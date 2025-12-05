#include "servers/TCPServer.h"
#include "compressions/RLE.h"
#include "commands/addCommand.h"
#include "commands/getCommand.h"
#include "commands/searchCommand.h"
#include "clientHandlers/naiveClientHandler.h"

#include <iostream>
#include <map>

int main(int argc, char *argv[]) {

    // Ensure enough args
    if (argc < 2) return 0;

    // Commands the server supports
    RLE comp;
    addCommand add(&comp);
    getCommand get(&comp);
    searchCommand search(&comp);

    // Map command name to class
    map<string, ICommand*> commands = {
        {"POST", &add},
        {"GET", &get},
        {"SEARCH", &search},
    };

    // An handler for new users
    NaiveClientHandler handler;
    mutex lock;

    try {
        // Init server
        int port = stoi(argv[1]);
        TCPServer server(commands, &handler, lock);
        server.startServer(port);

        // Serve clients forever
        while (true) server.serveClient();

        // Properly close the server if it stops or crashes
        server.closeServer();
    } catch (...) {}

    return 0;
}