// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package sockets

import (
	"bytes"
	"encoding/json"
	"log"
)

// hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	// Registered clients.
	clients map[*Client]bool

	// Inbound messages from the clients.
	broadcast chan []byte

	// Echo channel for clients.
	echo chan *ClientMessage

	// Create room channel for clients.
	create chan *ClientMessage

	// Register requests from the clients.
	register chan *Client

	// Unregister requests from clients.
	unregister chan *Client
}

var (
	rooms = make(map[string]bool)	
)

// channel type
type ClientMessage struct {
	client  *Client
	message []byte
}

func NewHub() *Hub {
	return &Hub{
		broadcast:  make(chan []byte),
		echo:       make(chan *ClientMessage),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
		create:     make(chan *ClientMessage),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.clients[client] = true

			payload := `{"response":"pong"}`
			client.send <- []byte(payload)
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}
		case cm := <-h.create:
			roomCode := createUniqueRoomCode()
			rooms[roomCode] = true
			resp := createMessage("ROOM_CREATED", roomCode)
			cm.client.send <- []byte(resp)
		case cm := <-h.echo:

			messageDecoder := json.NewDecoder(bytes.NewReader(cm.message))
			msg := &Message{}
			if err := messageDecoder.Decode(msg); err != nil {
				log.Fatalf("Error in WS sync, server/hub.go message := <-h.broadcast() :%s", err)
				return
			}

			payload := `{"op":"ECHO_RESPONSE","payload":"` + msg.Payload + `"}`
			cm.client.send <- []byte(payload)

		}
	}
}
