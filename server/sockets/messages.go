package sockets

const (
	// ops
	ECHO = "ECHO"
)

type Message struct {
	Op      string `json:"op"`
	Payload string `json:"payload"`
}
