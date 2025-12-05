#ifndef ICLIENT_H
#define ICLIENT_H

#include <string>
#include "../InputOutputs/SocketInputOutput.h"

class IClient {
    public:
        virtual ~IClient() = default;
        virtual bool connectToServer(const std::string& ip_address, int port_no) = 0;
        virtual void useServer() = 0;
        virtual void disconnect() = 0;
};

#endif