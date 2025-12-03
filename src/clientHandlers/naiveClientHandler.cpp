#include "IClientHandler.h"
#include "../compressions/ICompression.h"
#include "../compressions/RLE.h"
#include "../commands/addCommand.h"
#include "../commands/getCommand.h"
#include "../commands/searchCommand.h"
#include "../App.h"

#include <pthread.h>
#include <map>
#include <string>

// Creating this "temporary" struct to pass the argument to the thread function safely
struct ArgsPtr {
    // Pointer to SocketIO object
    SocketInputOutput* socket;
};

// The fucntion the thread executes to handle the communication with the client
void* handleClient(void* arg) {
    // Casting the argument back to SocketPtr
    ArgsPtr* argsPtr = (ArgsPtr*)arg;

    // Creating the commands map to pass it to the App instance
    ICompression* comp = new RLE();
    map<string, ICommand*> commands = {
        {"POST", new addCommand(comp)},
        {"GET", new getCommand(comp)},
        {"SEARCH", new searchCommand(comp)},
        //{"DELETE", new exitCommand(comp)},
    };

    // Creating an instance of App with the socket and commands argument to set up the communication with the client 
    App app(argsPtr->socket, commands);
    // Running the app to start and handle the communication
    app.run();

    // Cleaning up the allocated memory for SocketPtr
    delete argsPtr;
    // Returning NULL as the thread function's return type is void*
    return NULL;
}

class NaiveClientHandler : public IClientHandler {
    public:
        // Implementation of the createClientHandler method in the interface IClientHandler
        void createClientHandler(SocketInputOutput* socketIO) const override {
            // Creating a new thread to handle the communication with the client
            pthread_t thread;
            
            // Allocating memory for SocketPtr to pass the SocketIO object to the thread function safely
            struct ArgsPtr* argsPtr = new ArgsPtr();
            // Assigning the argument to the struct in order to pass it to the thread safely
            argsPtr->socket = socketIO;

            // Creating the socket itself to execute the method handleClient with the relevant arguments
            pthread_create(&thread, NULL, handleClient, (void*)argsPtr);
        }
};