// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package sockets

import (
	"math/rand"	
	"bytes"
	"encoding/json"
	"log"
)

type RoomData struct {
	player1 *Client
	player2 *Client
}

const (
	// room code length
	roomCodeLen = 4

	// valid room code characters
	roomCodeBytes = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
)

func createUniqueRoomCode() string {
	var roomCode string
	for {
		roomCode, _ = createRoomCode()
		// Check for existence of roomCode
		if _, ok := rooms[roomCode]; !ok {
			break
		}
	}
	return roomCode
}

func createRoomCode() (string, error) {
	b := make([]byte, roomCodeLen)
	for i := range b {
		b[i] = roomCodeBytes[rand.Intn(len(roomCodeBytes))]
	}
	return string(b), nil
}

func getPayload(message []byte) (string, error) {
	messageDecoder := json.NewDecoder(bytes.NewReader(message))
	msg := &Message{}
	if err := messageDecoder.Decode(msg); err != nil {
		log.Fatalf("Error in WS sync, server/hub.go message := <-h.broadcast() :%s", err)
		return "", err
	}
	return msg.Payload, nil
}
