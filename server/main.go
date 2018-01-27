package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
)

var (
	host string
	port string
)

const (
	defaultHost  = ""
	hostFlagDesc = "server -h xx.yy.zz.xx"
	defaultPort  = "8000"
	portFlagDesc = "server -p 8000"
)

func main() {
	flag.StringVar(&host, "host", defaultHost, hostFlagDesc)
	flag.StringVar(&host, "h", defaultHost, hostFlagDesc)
	flag.StringVar(&port, "port", defaultPort, portFlagDesc)
	flag.StringVar(&port, "p", defaultPort, portFlagDesc)
	flag.Parse()
	http.Handle("/", http.FileServer(http.Dir("../public")))

	addr := host + ":" + port
	fmt.Printf("Server listening on %s\n", addr)
	log.Fatal(http.ListenAndServe(addr, nil))
}
