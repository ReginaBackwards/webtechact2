# Website Hosting with Go

This README provides instructions on how to install and set up a local web server using Go to host your website in the VSCode IDE. The web server serves HTML, CSS, JavaScript, and JSON files using the `host.go` file.

## Prerequisites

Before you get started, make sure you have the following prerequisites installed on your system:

- [Visual Studio Code (VSCode)](https://code.visualstudio.com/)
- [Go extension for VSCode](https://code.visualstudio.com/docs/languages/go)
- Go programming language installed on your system (you mentioned it's already installed)


## Running the Web Server

1. Open your project folder in VSCode.

2. Open the integrated terminal in VSCode (you can use `Ctrl+~` or `View > Terminal`).

3. Run the following command to start the Go web server:
		go run host.go

		The server will start and indicate the port it is listening on (default is 8080).

4. Open your web browser and navigate to `http://localhost:8080`. Replace `8080` with the port specified in the terminal if you used a different port.

Your website should now be accessible locally via the Go web server.


## Accessing the Website

Open your web browser and enter the following URL:

	http://localhost:8080


## Stopping the Server

To stop the web server, go to the terminal where the server is running and press `Ctrl+C`. This will gracefully shut down the server.



