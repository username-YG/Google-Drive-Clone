#ifndef ICLIENTHANDLER_H
#define ICLIENTHANDLER_H

#include "../App.h"

class IClientHandler {
    public:
        // The function creates a client handler with the given app to run
        virtual void createClientHandler(App* app) = 0;
};

// Creating this "temporary" struct to pass the argument to the thread function safely
struct ArgsPtr {
    App* app;
};

// The function the thread executes to handle the communication with the client
inline void* handleClient(void* arg) {
    // Casting the argument back to ArgsPtr
    ArgsPtr* argsPtr = (ArgsPtr*)arg;
    // Running the app to start and handle the communication
    argsPtr->app->run();

    // Cleaning up allocated memory
    delete argsPtr->app;
    delete argsPtr;
    return NULL;
}

#endif