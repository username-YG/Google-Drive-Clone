#ifndef ICLIENT_H
#define ICLIENT_H

#include <string>

/**
 * @brief IClient: The base interface for all client types.
 * This class defines a contract of operations that any derived class
 * (such as TCPClient) must implement.
 */
class IClient {
public:
    virtual ~IClient() = default;

    /**
     * @brief Attempts to establish a connection to a remote server.
     * @param ip_address The IP address of the server.
     * @param port_no The port number of the server.
     * @return true if the connection was successful, false otherwise.
     */
    virtual bool connectToServer(const std::string& ip_address, int port_no) = 0;

    /**
     * @brief Executes the main server interaction loop.
     * Gets user command, send to server, receive response).
     */
    virtual void useServer() = 0;

    /**
     * @brief closes the connection.
     * responsible for releasing system resources
     * (such as closing the socket descriptor).
     */
    virtual void disconnect() = 0;
};

#endif