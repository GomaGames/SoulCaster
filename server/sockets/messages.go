package sockets

import "encoding/json"

const (
	// ops
	ATTACK                = "ATTACK"
	CREATE                = "CREATE_ROOM"
	DISCONNECT            = "DISCONNECT"
	ECHO                  = "ECHO"
	GAME_OVER             = "GAME_OVER"
	GAME_STARTED          = "GAME_STARTED"
	JOIN                  = "JOIN_ROOM"
	OBTAIN_UPGRADE        = "OBTAIN_UPGRADE"
	PURCHASE_UPGRADE      = "PURCHASE_UPGRADE"
	RECEIVE_ATTACK        = "RECEIVE_ATTACK"
	SENT_ATTACK           = "SENT_ATTACK"
	SET_MONEY             = "SET_MONEY"
	START_GAME            = "START_GAME"
	RGE_TRIGGERED         = "RGE_TRIGGERED"
	RGE_PAID              = "RGE_PAID"
	RGE_DECLINED          = "RGE_DECLINED"
	RGE_ACTIVATE          = "RGE_ACTIVATE"
	RGE_PAYMENT_CONFIRMED = "RGE_PAYMENT_CONFIRMED"
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

func createStartGameMessage(health, money, income int) ([]byte, error) {
	payloadObj := PlayerInfo{Money: money, Income: income}
	payloadObj.Health = health
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

func createPayRgeMessage(id, health, money, income int) ([]byte, error) {
	payloadObj := PlayerInfo{
		Money:  money,
		Income: income,
	}
	payloadObj.Health = 0
	payload, err := json.Marshal(payloadObj)
	if err != nil {
		return nil, err
	}
	return createMessage(RGE_PAYMENT_CONFIRMED, string(payload))
}

type RgeTrigger struct {
	Id int `json:"id"`
}

func createRgeTriggerMessage(id int) ([]byte, error) {
	payloadObj := RgeTrigger{Id: id}
	payload, err := json.Marshal(payloadObj)
	if err != nil {
		return nil, err
	}
	return createMessage(RGE_TRIGGERED, string(payload))
}

type FinalPlayerInfo struct {
	PlayerInfo
	Victory       bool `json:"victory"`
	RGEPaidHealth int  `json:"rgePaidHealth"`
	RGEPaidMoney  int  `json:"rgePaidMoney"`
}

func createFinalPlayerInfo(victory bool, health, money, income, rgePaidHealth, rgePaidMoney int) *FinalPlayerInfo {
	fpi := &FinalPlayerInfo{
		Victory:       victory,
		RGEPaidHealth: rgePaidHealth,
		RGEPaidMoney:  rgePaidMoney,
	}
	fpi.Health = health
	fpi.Money = money
	fpi.Income = income
	return fpi
}

type GameOver struct {
	Player1 *FinalPlayerInfo `json:"player1"`
	Player2 *FinalPlayerInfo `json:"player2"`
}
