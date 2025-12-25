#include "servers/TCPServer.h"
#include "compressions/RLE.h"
#include "commands/addCommand.h"
#include "commands/getCommand.h"
#include "commands/searchCommand.h"
#include "commands/deleteCommand.h"
#include "clientHandlers/threadPoolClientHandler.h"

#include <iostream>
#include <map>
#include <cstdlib> // Required for getenv
#include <string>  // Required for stoi

int main(int argc, char *argv[]) {

    // Ensure enough args
    if (argc < 2) return 0;

    // Read environment variables set in docker-compose.yml
    const char* envMaxClients = std::getenv("MAX_CLIENTS");
    const char* envMaxThreads = std::getenv("MAX_CLIENTS_AT_ONCE");

    // Convert to integers with fallback defaults (3 and 10)
    int maxClients = envMaxClients ? std::stoi(envMaxClients) : 3;
    int maxThreads = envMaxThreads ? std::stoi(envMaxThreads) : 10;

    // Commands the server supports
    RLE comp;
    addCommand add(&comp);
    getCommand get(&comp);
    searchCommand search(&comp);
    deleteCommand deleteC;

    // Map command name to class
    map<string, pair<ICommand*, string>> commands = {
        {"POST", {&add, "201 Created\n"}},
        {"GET", {&get, "200 Ok\n\n"}},
        {"SEARCH", {&search, "200 Ok\n\n"}},
        {"DELETE", {&deleteC, "204 No Content\n"}}
    };

    // Map error to error message
    map<string, string> errMsg = {
        {"Invalid command", "400 Bad Request\n"},
        {"Logical error", "404 Not Found\n"},
        {"Default", "500 Internal Server Error\n"}
    };

    // A handler for new users
    ThreadPoolClientHandler& handler = ThreadPoolClientHandler::instance(maxThreads);
    mutex lock;

    try {
        // Init server
        int port = stoi(argv[1]);
        TCPServer server(commands, &handler, lock, errMsg, maxClients);
        server.startServer(port);

        // Serve clients forever
        while (true) server.serveClient();

        // Properly close the server if it stops or crashes
        server.closeServer();
    } catch (...) {}

    return 0;
}