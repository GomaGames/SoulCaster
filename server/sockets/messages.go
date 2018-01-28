package sockets

const (
	// ops
	ATTACK = "ATTACK"
	ECHO   = "ECHO"
	CREATE = "CREATE_ROOM"
)

type Message struct {
	Op      string `json:"op"`
	Payload string `json:"payload"`
}

func createMessage(op string, payload string) string {
	return `{"op":"` + op + `", "payload":"` + payload + `"}`
}
