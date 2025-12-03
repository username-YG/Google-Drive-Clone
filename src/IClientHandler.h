#ifndef ICLIENTHANDLER_H
#define ICLIENTHANDLER_H

#include "SocketIO.h"


class IClientHandler {
    public:
        // The function creates a client handler with the given SocketIO (Socket Input/Output "stream")
        virtual void createClientHandler(SocketIO socketIO) const = 0;
};

#endif