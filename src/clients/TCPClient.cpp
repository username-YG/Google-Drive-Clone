#include "../clients/TCPClient.h"
#include "../InputOutputs/SocketInputOutput.h"
#include "../InputOutputs/StreamInputOutput.h"
#include <cstring>
#include <netdb.h>
// Constructor: Initializes members and creates the raw socket file descriptor.
TCPClient::TCPClient() : socket_fd(-1), is_connected(false), socket_io(nullptr) {

    // Creates a new TCP/IPv4 socket.
    socket_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (socket_fd < 0) {
        // If socket creation fails, socket_fd remains -1. No error output permitted.
        return;
    }
}

// Accessor to get the internal socket file descriptor.
int TCPClient::getSocketDescriptor() const {
    return socket_fd;
}

// Implements IClient::connectToServer: Attempts to establish the TCP connection.
bool TCPClient::connectToServer(const std::string& ip_address, int port_no) {
    // Check if the initial socket creation was successful.
    if (socket_fd < 0) {
        return false;
    }

    // Setup the server address structure (sockaddr_in).
    struct sockaddr_in sin;
    std::memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_port = htons(port_no);

    // Convert IP address string to binary format.
    struct hostent* server = gethostbyname(ip_address.c_str());
    if (server == NULL) return false;
    std::memcpy(&sin.sin_addr.s_addr, server->h_addr, server->h_length);

    // Initiate the TCP connection (Three-Way Handshake).
    if (connect(socket_fd, (struct sockaddr *) &sin, sizeof(sin)) < 0) {
        is_connected = false;
        return false;
    }

    // Connection successful. Initialize the SocketInputOutput object.
    int sharedSock = TCPClient::getSocketDescriptor();
    // For TCP, the input and output descriptors are the same.
    socket_io = new SocketInputOutput(sharedSock, sharedSock);

    is_connected = true;
    return true;
}

// Implements IClient::useServer: Runs the main user-server interaction loop.
void TCPClient::useServer() {
    // Check if the connection is active.
    if (!is_connected) {
        return;
    }

    // Stream for console I/O (cin/cout).
    StreamInputOutput stream_io(std::cin, std::cout);

    std::string user_input;
    std::string server_response;

    try {
        while (true) {
            // Get command from user (console stream).
            user_input = stream_io.getInput();

            if (user_input.empty()) {
                continue;
            }

            // Send command to the server (socket stream).
            socket_io->returnOutput(user_input);
            // Wait for and receive the response (socket stream).
            server_response = socket_io->getInput();
            // Display response to the user (console stream).
            stream_io.returnOutput(server_response);
        }
    }
    // Catch I/O errors (e.g., server closed connection, send/recv failure).
    catch (const std::runtime_error& e) {
        return;
    }
    catch (...) {
        return;
    }

    // Clean up the connection after loop exit (either by 'exit' command or error).
    disconnect();
}


// Implements IClient::disconnect: Closes the socket and resets status.
void TCPClient::disconnect() {
    // Only close the file descriptor if it's valid (>= 0).
    if (socket_fd >= 0) {
        close(socket_fd);
        socket_fd = -1; // Invalidate the descriptor.
    }
    delete socket_io;
    is_connected = false;
}