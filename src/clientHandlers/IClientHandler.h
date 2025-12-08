#ifndef ICLIENTHANDLER_H
#define ICLIENTHANDLER_H

#include "../App.h"

class IClientHandler {
    public:
        // The function creates a client handler with the given app to run
        virtual void createClientHandler(App* app) = 0;
};

#endif