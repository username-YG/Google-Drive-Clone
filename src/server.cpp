#include "servers/TCPServer.h"
#include "compressions/RLE.h"
#include "commands/addCommand.h"
#include "commands/getCommand.h"
#include "commands/searchCommand.h"
#include "commands/deleteCommand.h"
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

    // An handler for new users
    NaiveClientHandler handler;
    mutex lock;

    try {
        // Init server
        int port = stoi(argv[1]);
        TCPServer server(commands, &handler, lock, errMsg);
        server.startServer(port);

        // Serve clients forever
        while (true) server.serveClient();

        // Properly close the server if it stops or crashes
        server.closeServer();
    } catch (...) {}

    return 0;
}