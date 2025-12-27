#include "naiveClientHandler.h"
#include "../App.h"

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