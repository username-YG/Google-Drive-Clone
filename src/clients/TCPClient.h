#ifndef TCPCLIENT_H
#define TCPCLIENT_H

#include "IClient.h"
#include "../InputOutputs/SocketInputOutput.h"
#include <sys/socket.h>
#include <netinet/in.h>
#include <string>
#include <unistd.h>
#include <arpa/inet.h>


// @brief TCPClient: Implements the IClient interface using the TCP protocol.
class TCPClient : public IClient {
private:
     // The file descriptor for the socket connection.
    int socket_fd;
     // Flag indicating the current connection status.
    bool is_connected;

public:
    // Constructor: Initializes state variables and creates the socket resource.
    TCPClient();
    // Destructor: Ensures the connection is closed and resources are released.
    ~TCPClient() override;

    // Attempts to connect the socket to the specified server IP and port.
    bool connectToServer(const std::string& ip_address, int port_no) override;
    // Executes the main communication loop between the user stream and the server socket.
    void useServer() override;
    // Closes the socket connection and resets the connection state.
    void disconnect() override;

    // return The socket file descriptor (socket_fd).
    int getSocketDescriptor() const;
    // Handles the actual read and write operations on the socket file descriptor.
    SocketInputOutput socket_io;
};

#endif