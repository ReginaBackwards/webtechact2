package main

import (
	"net/http"
)

func main() {
	// Define a file server to serve your static files
	fs := http.FileServer(http.Dir(".")) // Serve files from the current directory

	http.Handle("/", fs)

	// Start the HTTP server on port 8080
	port := "8080"
	println("Server started on port " + port)
	http.ListenAndServe(":"+port, nil)
}
