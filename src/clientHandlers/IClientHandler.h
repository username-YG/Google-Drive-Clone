#ifndef ICLIENTHANDLER_H
#define ICLIENTHANDLER_H

#include "../InputOutputs/SocketInputOutput.h"


class IClientHandler {
    public:
        // The function creates a client handler with the given SocketIO (Socket Input/Output "stream")
        virtual void createClientHandler(SocketInputOutput* socketIO) const = 0;
};

#endif