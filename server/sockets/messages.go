package sockets

import "encoding/json"

const (
	// ops
	ATTACK           = "ATTACK"
	ECHO             = "ECHO"
	CREATE           = "CREATE_ROOM"
	OBTAIN_UPGRADE   = "OBTAIN_UPGRADE"
	PURCHASE_UPGRADE = "PURCHASE_UPGRADE"
)

type Message struct {
	Op      string `json:"op"`
	Payload string `json:"payload"`
}

func createMessage(op string, payload string) string {
	return `{"op":"` + op + `", "payload":"` + payload + `"}`
}

type PlayerInfo struct {
	Health int `json:"health"`
	Money  int `json:"money"`
	Income int `json:"income"`
}

type ObtainUpgradePayload struct {
	PlayerInfo
	Id int `json:"id"`
}

func createObtainUpgradeMessage(id, health, money, income int) (string, error) {
	payloadObj := ObtainUpgradePayload{Id: id}
	payloadObj.Health = health
	payloadObj.Money = money
	payloadObj.Income = income
	payload, err := json.Marshal(payloadObj)
	if err != nil {
		return "", err
	}
	return createMessage(OBTAIN_UPGRADE, string(payload)), nil
}
