#include "TCPServer.h"
#include "../App.h"
#include "../InputOutputs/SocketInputOutput.h"
#include "../clientHandlers/IClientHandler.h"

#include <netinet/in.h>
#include <stdexcept>
#include <unistd.h>

TCPServer::TCPServer(
    map<string, pair<ICommand*, string>> commands,
    IClientHandler* handler,
    mutex& lock,
    map<string, string> errMsg,
    int maxClients
    ) : commands(commands), handler(handler), lock(lock), errMsg(errMsg), maxClients(maxClients) {}

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
    if (listen(serverSocket, maxClients) < 0) throw runtime_error("Listen failed.");

}

void TCPServer::serveClient() const {
    struct sockaddr_in clientAddr;
    socklen_t clientAddrLen = sizeof(clientAddr);

    // Accept a client
    int clientSocket = accept(serverSocket, (struct sockaddr *)&clientAddr, &clientAddrLen);
    if (clientSocket < 0) return; // Just skip this client

    // Creating an instance of App with sockets to set up the communication with the client
    SocketInputOutput* socketIO = new SocketInputOutput(clientSocket, clientSocket);
    App* app = new App(socketIO, commands, lock, errMsg);
    handler->createClientHandler(app);
}

void TCPServer::closeServer() const {
    close(serverSocket);
}