package sockets

import "encoding/json"

const (
	// ops
	ATTACK           = "ATTACK"
	ECHO             = "ECHO"
	CREATE           = "CREATE_ROOM"
	DISCONNECT       = "DISCONNECT"
	JOIN             = "JOIN_ROOM"
	START_GAME       = "START_GAME"
	GAME_STARTED     = "GAME_STARTED"
	OBTAIN_UPGRADE   = "OBTAIN_UPGRADE"
	PURCHASE_UPGRADE = "PURCHASE_UPGRADE"
	RECEIVE_ATTACK   = "RECEIVE_ATTACK"
)

type Message struct {
	Op      string `json:"op"`
	Payload string `json:"payload"`
}

func createMessage(op string, payload string) ([]byte, error) {
	msg := Message{
		Op:      op,
		Payload: payload,
	}
	return json.Marshal(msg)
}

type HealthInfo struct {
	Health int `json:"health"`
}

func createHealthPayload(health int) ([]byte, error) {
	payloadObj := HealthInfo{Health: health}
	return json.Marshal(payloadObj)
}

type PlayerInfo struct {
	HealthInfo
	Money  int `json:"money"`
	Income int `json:"income"`
}

type ObtainUpgradePayload struct {
	PlayerInfo
	Id int `json:"id"`
}

func createStartGameMessage() ([]byte, error) {
	payloadObj := PlayerInfo{}
	payloadObj.Health = 1000
	payloadObj.Money = 0
	payloadObj.Income = 5
	
	payload, err := json.Marshal(payloadObj)
	if err != nil {
		return nil, err
	}
	return createMessage(GAME_STARTED, string(payload))
}

func createObtainUpgradeMessage(id, health, money, income int) ([]byte, error) {
	payloadObj := ObtainUpgradePayload{Id: id}
	payloadObj.Health = health
	payloadObj.Money = money
	payloadObj.Income = income
	payload, err := json.Marshal(payloadObj)
	if err != nil {
		return nil, err
	}
	return createMessage(OBTAIN_UPGRADE, string(payload))
}
