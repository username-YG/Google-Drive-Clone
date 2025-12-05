#ifndef TCPCLIENT_H
#define TCPCLIENT_H

#include "IClient.h"
#include <sys/socket.h>
#include <netinet/in.h>
#include <string>
#include <unistd.h>
#include <arpa/inet.h>

class TCPClient : public IClient {
private:
    int socket_fd;
    bool is_connected;

public:
    TCPClient();
    ~TCPClient() override;
    bool connectToServer(const std::string& ip_address, int port_no) override;
    void useServer() override;
    void disconnect() override;
    int getSocketDescriptor() const;
    SocketInputOutput* socket_io;
};

#endif // TCPCLIENT_H