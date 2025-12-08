#include "naiveClientHandler.h"
#include "../App.h"

// Creating this "temporary" struct to pass the argument to the thread function safely
struct ArgsPtr {
    App* app;
};

// The fucntion the thread executes to handle the communication with the client
void* handleClient(void* arg) {
    // Casting the argument back to SocketPtr
    ArgsPtr* argsPtr = (ArgsPtr*)arg;
    // Running the app to start and handle the communication
    argsPtr->app->run();

    // Cleaning up allocated memory
    delete argsPtr->app;
    delete argsPtr;
    return NULL;
}

// Implementation of the createClientHandler method in the interface IClientHandler
void NaiveClientHandler::createClientHandler(App* app) {
    // Creating a new thread to handle the communication with the client
    pthread_t thread;
    
    // Allocating memory for SocketPtr to pass the SocketIO object to the thread function safely
    struct ArgsPtr* argsPtr = new ArgsPtr();
    argsPtr->app = app;

    // Creating the socket itself to execute the method handleClient with the relevant arguments
    pthread_create(&thread, NULL, handleClient, (void*)argsPtr);
}