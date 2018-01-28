// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package sockets

import (
	"math/rand"	
)	

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
