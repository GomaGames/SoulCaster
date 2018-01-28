// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package sockets

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"time"

	"../game"
	"github.com/gorilla/websocket"
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	// Time a client must wait before sending another attack
	attackWait = time.Second

	// Income timer
	incomePeriod = time.Second

	// Starting attack power
	startingAttackPower = 10

	// Starting health
	startingHealth = 1000

	// Starting money
	startingMoney = 0

	// Starting income
	startingIncome = 5

	// Maximum message size allowed from peer.
	maxMessageSize = 51200

	// Number of attacks before affecting resolution
	attackResolutionCapCount1 = 10
	attackResolutionCapCount2 = 20
	attackResolutionCapCount3 = 50
)

var (
	newline = []byte{'\n'}
	space   = []byte{' '}
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

// Client is an middleman between the websocket connection and the hub.
type Client struct {
	hub *Hub

	// The websocket connection.
	conn *websocket.Conn

	// Buffered channel of outbound messages.
	send chan []byte

	// Current room
	currentRoom *Room

	// The last time the client tried to attack
	lastAttack *time.Time

	// Attack Power
	attackPower int

	// Health
	health int

	// Money
	money int

	// Income per tick
	income int

	// Send a value to this channel to stop income
	stopIncome chan bool

	// Amount of health spent on RGE
	rgePaidHealth int

	// Amount of money spent on RGE
	rgePaidMoney int

	// Counter for Attack count for RGE
	rgeAttackCount int
}

func (c *Client) SetCurrentRoom(room *Room) {
	c.LeaveRoom(true)
	c.currentRoom = room
}

func (c *Client) LeaveRoom(disconnected bool) {
	if c.stopIncome != nil {
		log.Printf("Player %p stopping income", c)
		c.stopIncome <- true
		c.stopIncome = nil
	}

	if c.currentRoom != nil {
		log.Printf("%p leaving room %v", c, c.currentRoom.code)
		c.currentRoom.ready--

		var message []byte = nil
		if disconnected {
			var err error
			message, err = createMessage(DISCONNECT, "")
			if err != nil {
				message = nil
			}
		}

		c.hub.leave <- newOpponentMessage(c, c.currentRoom, message)
		c.currentRoom = nil
	}
}

func (c *Client) StartGame() {
	if c.currentRoom != nil {
		c.attackPower = startingAttackPower
		c.health = startingHealth
		c.money = startingMoney
		c.income = startingIncome
		c.rgePaidHealth = 0
		c.rgePaidMoney = 0
		c.rgeAttackCount = 0
		msg, err := createStartGameMessage(c.health, c.money, c.income)
		if err == nil {
			c.send <- msg
		}
		c.currentRoom.ready++

		c.stopIncome = make(chan bool)
		go c.handleIncome()
	}
}

func (c *Client) ReceiveAttack(damage int) {
	c.health -= damage
	payload, err := createHealthPayload(c.health)
	if err == nil {
		// TODO: handle errors
		if msg, err := createMessage(SENT_ATTACK, string(payload)); err == nil {
			c.hub.opponent <- newOpponentMessage(c, c.currentRoom, msg)
		}
		if msg, err := createMessage(RECEIVE_ATTACK, string(payload)); err == nil {
			c.send <- msg
		}

		if c.health <= 0 {
			log.Printf("Player %p has died!", c)
			c.hub.gameover <- &RoomMessage{client: c, room: c.currentRoom}
		}
	}
}

func (c *Client) GetFinalPlayerInfo(winner bool) *FinalPlayerInfo {
	return createFinalPlayerInfo(winner, c.health, c.money, c.income, c.rgePaidHealth, c.rgePaidMoney)
}

func (c *Client) handleIncome() {
	log.Printf("Starting income for player %p", c)
	ticker := time.NewTicker(incomePeriod)
	defer ticker.Stop()
	for {
		select {
		case <-ticker.C:
			c.money += c.income

			if msg, err := createMessage(SET_MONEY, strconv.Itoa(c.money)); err == nil {
				c.send <- msg
			}
		case <-c.stopIncome:
			log.Printf("Player %p stopping income", c)
			return
		}
	}
}

// readPump pumps messages from the websocket connection to the hub.
func (c *Client) readPump() {
	defer func() {
		c.hub.unregister <- c
		c.conn.Close()

		if c.stopIncome != nil {
			c.stopIncome <- true
			c.stopIncome = nil
		}
	}()
	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error { c.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway) {
				log.Printf("error: %v", err)
			}
			break
		}
		message = bytes.TrimSpace(bytes.Replace(message, newline, space, -1))

		m := &Message{}
		if err := json.Unmarshal(message, m); err != nil {
			log.Printf("error: %v", err)
			break
		}

		log.Printf("message: %s", message)

		switch m.Op {
		case ATTACK:
			if c.currentRoom != nil && c.currentRoom.ready >= 2 {
				now := time.Now()
				if c.lastAttack == nil || now.Sub(*c.lastAttack) > attackWait {
					c.lastAttack = &now
					c.hub.attack <- newAttackMessage(c, c.currentRoom, c.attackPower)
					c.rgeAttackCount += 1
					sendRge := false
					id := 0
					if c.rgeAttackCount == attackResolutionCapCount1 {
						sendRge = true
						id = 1
					}
					if c.rgeAttackCount == attackResolutionCapCount2 {
						sendRge = true
						id = 2
					}
					if c.rgeAttackCount == attackResolutionCapCount3 {
						sendRge = true
						id = 3
					}
					if sendRge {
						if resp, err := createRgeTriggerMessage(id); err == nil {
							c.send <- resp
						}
					}
				}
			}
		case CREATE:
			c.hub.create <- &ClientMessage{client: c, message: message}
		case JOIN:
			c.hub.join <- &ClientMessage{client: c, message: []byte(m.Payload)}
		case START_GAME:
			if c.currentRoom != nil {
				c.hub.start <- &RoomMessage{client: c, room: c.currentRoom}
				c.StartGame()
			}
		case PURCHASE_UPGRADE:
			if c.currentRoom == nil || c.currentRoom.ready < 2 {
				continue
			}

			itemId, err := strconv.Atoi(m.Payload)
			if err != nil {
				// TODO: return error to client
				continue
			}

			item, ok := game.Items[itemId]
			if !ok {
				// TODO: return error to client
				continue
			}

			if c.money >= item.Cost {
				response, err := createObtainUpgradeMessage(itemId, c.health, c.money-item.Cost, c.income+item.AdditionalIncome)
				if err != nil {
					// TODO: return error to client
					continue
				}

				c.money -= item.Cost
				c.attackPower += item.AdditionalPower
				c.income += item.AdditionalIncome

				c.send <- []byte(response)
			} else {
				// TODO: return error to client
				continue
			}
		// case RGE_PAID:
		// 	rgeId, err := strconv.Atoi(m.Payload)
		// 	if err != nil {
		// 		continue
		// 	}
		case RGE_DECLINED:
			if msg, err := createMessage(RGE_ACTIVATE, m.Payload); err == nil {
				c.send <- msg
			}
		case ECHO:
			c.hub.echo <- &ClientMessage{client: c, message: message}
		}
	}
}

// write writes a message with the given message type and payload.
func (c *Client) write(mt int, payload []byte) error {
	c.conn.SetWriteDeadline(time.Now().Add(writeWait))
	return c.conn.WriteMessage(mt, payload)
}

// writePump pumps messages from the hub to the websocket connection.
func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			if !ok {
				// The hub closed the channel.
				c.write(websocket.CloseMessage, []byte{})
				return
			}

			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			// Add queued chat messages to the current websocket message.
			n := len(c.send)
			for i := 0; i < n; i++ {
				w.Write(newline)
				w.Write(<-c.send)
			}

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			if err := c.write(websocket.PingMessage, []byte{}); err != nil {
				return
			}
		}
	}
}

// ServeWs handles websocket requests from the peer.
func ServeWs(hub *Hub, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	client := &Client{hub: hub, conn: conn, send: make(chan []byte, 256)}
	client.hub.register <- client
	go client.writePump()
	client.readPump()
}
