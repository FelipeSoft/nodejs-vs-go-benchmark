package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"
)

type Message struct {
	Message string `json:"message"`
}

func main() {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, os.Kill)
	defer stop()

	mux := http.NewServeMux()
	mux.HandleFunc("/golang", func(w http.ResponseWriter, r *http.Request) {
		time.Sleep(time.Millisecond * 100)
		body, err := json.Marshal(Message{Message: "ok"})
		if err != nil {
			log.Print(err)
		}
		w.WriteHeader(http.StatusOK)
		w.Write(body)
	})

	go func() {
		log.Print("HTTP server listening on 127.0.0.1:8081")
		if err := http.ListenAndServe("127.0.0.1:8081", mux); err != nil {
			log.Fatalf("Could not start the HTTP server listening on 127.0.0.1:8081: %v", err)
		}
	}()

	<-ctx.Done()
	log.Print("Exited")
}
