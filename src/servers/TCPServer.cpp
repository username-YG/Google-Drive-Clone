#include "TCPServer.h"
#include "../App.h"
#include "../InputOutputs/SocketInputOutput.h"
#include "../clientHandlers/IClientHandler.h"

#include <netinet/in.h>
#include <stdexcept>
#include <unistd.h>

TCPServer::TCPServer(map<string, ICommand*> commands, IClientHandler* handler, mutex& lock) : commands(commands), handler(handler), lock(lock) {}

void TCPServer::startServer(int port) {
    
    // Create socket
    serverSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (serverSocket < 0) throw runtime_error("Socket creation failed.");

    // Configure server address
    struct sockaddr_in serverAddr;
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_addr.s_addr = INADDR_ANY;
    serverAddr.sin_port = htons(port);

    // Bind the socket
    if (bind(serverSocket, (struct sockaddr *)&serverAddr, sizeof(serverAddr)) < 0) throw runtime_error("Bind failed.");

    // Listen for incoming connections
    if (listen(serverSocket, MAX_CLIENTS) < 0) throw runtime_error("Listen failed.");

}

// Decides what output to return based on command name, output and exceptions
// Response code are part of the server logic, not the app or commands
string outputHanler(string &name, string &output, string &eMsg) {

    if (eMsg == "") {

        // Sucess status
        if (name == "POST") {
            return "201 Created\n";
        } else if (name == "GET" || name == "SEARCH") {
            return "200 Ok\n\n" + output;
        } else if (name == "DELETE") {
            return "204 No Content\n";
        } else {
            // Test commands shouldn't have responses
            return output;
        }

    } else {

        // Error status
        if (eMsg.find("Invalid command") != string::npos) {
            return "400 Bad Request\n";
        } else if (eMsg.find("Logical error") != string::npos) {
            return "404 Not Found\n";
        } else {
            return "500 Internal Server Error\n";
        }

    }

}

void TCPServer::serveClient() const {
    struct sockaddr_in clientAddr;
    socklen_t clientAddrLen = sizeof(clientAddr);

    // Accept a client
    int clientSocket = accept(serverSocket, (struct sockaddr *)&clientAddr, &clientAddrLen);
    if (clientSocket < 0) return; // Just skip this client

    // Creating an instance of App with sockets to set up the communication with the client
    SocketInputOutput* socketIO = new SocketInputOutput(clientSocket, clientSocket);
    App* app = new App(socketIO, commands, lock, outputHanler);
    handler->createClientHandler(app);
}

void TCPServer::closeServer() const {
    close(serverSocket);
}