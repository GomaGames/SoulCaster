package main

import (
	"fmt"
	"log"
	"net/http"
)

const (
	defaultPort = "8000"
)

func main() {
	http.Handle("/", http.FileServer(http.Dir("../public")))

	fmt.Printf("Server listening on %s\n", defaultPort)
	log.Fatal(http.ListenAndServe(":"+defaultPort, nil))
}
