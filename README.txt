# Website Hosting with Go

This README provides instructions on how to install and set up a local web server using Go to host your website in the VSCode IDE. The web server serves HTML, CSS, JavaScript, and JSON files using the `host.go` file.


======================== RUNNING THE WEBSERVER ========================


|| OPTION A: Using Command Prompt ||
## Prerequisite

Before you get started, make sure you have the following prerequisite installed on your system:

- Go programming language (go1.21.3.windows-386.msi)

<< STEPS: >>
1. Verify that Go is installed by running this command:

			go version

2. Create a directory for your Go workspace, for example, C:\go-workspace:

			mkdir C:\go-workspace

3. Set the GOPATH environment variable to point to this directory:

			setx GOPATH C:\go-workspace

4. Create a bin directory within your workspace for storing Go binaries:

			mkdir C:\go-workspace\bin

5. Add the bin directory to your PATH environment variable so that Go binaries can be executed from the Command Prompt:

			setx PATH "%PATH%;C:\go-workspace\bin"

6. Restart the Command Prompt.

7. Navigate to the path of your project folder (e.g. C:\Users\America\Desktop\webtechact2):

			cd C:\Users\America\Desktop\webtechact2

			** Replace the path with the actual path of your project folder.

8. Run the following command to start the Go web server:

			go run host.go

			** The server will start and indicate the port it is listening on (default is 8080).

9. Open your web browser and navigate to `http://localhost:8080`. Replace `8080` with the port specified in the terminal if you used a different port.

			Your website should now be accessible locally via the Go web server.


|| OPTION B: Using VSCode ||
## Prerequisite

Before you get started, make sure you have the following prerequisite installed on your system:

- [Visual Studio Code (VSCode)](https://code.visualstudio.com/)
- Go programming language installed on your system (go1.21.3.windows-386.msi)
- Go extension for VSCode (https://code.visualstudio.com/docs/languages/go)

<< STEPS: >>
1. Verify that Go is installed by running this command:

			go version

2. Open your project folder in VSCode.

3. Double-click the host.go file and if an installation prompt appears, accept and install the installations.

4. A VSCode Terminal will be opened, if not, you can access the Terminal by using `Ctrl+~` or `View > Terminal`.

5. Verify that the terminal's path is correct (VSCode project folder), if not, change directory with this command:

			cd C:\Users\America\Desktop\webtechact2

			** Replace the path with the actual path of your VSCode project folder.

6. Run the following command to start the Go web server:

			go run host.go

			** The server will start and indicate the port it is listening on (default is 8080).

7. Open your web browser and navigate to `http://localhost:8080`. 

			Replace `8080` with the port specified in the terminal if you used a different port.
			Your website should now be accessible locally via the Go web server.



======================== STOPPING THE WEBSERVER ========================

To stop the web server, go to the terminal where the server is running and press `Ctrl+C`. 
	This will shut down the server.



