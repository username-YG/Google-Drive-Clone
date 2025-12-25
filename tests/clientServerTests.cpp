#include <gtest/gtest.h>
#include <thread>

#include "../src/servers/TCPServer.h"
#include "../src/clientHandlers/naiveClientHandler.h"
#include "../src/clientHandlers/threadPoolClientHandler.h"
#include "../src/clients/TCPClient.h"
#include "../src/commands/addCommand.h"
#include "../src/commands/getCommand.h"
#include "../src/commands/searchCommand.h"
#include "../src/commands/deleteCommand.h"
#include "../src/compressions/RLE.h"

#define MIN_PORT 49152
#define MAX_PORT 65535

void testClientServer(vector<pair<string, string>> IOMap, map<string, pair<ICommand*, string>> commands, map<string, string> errMsg) {

    NaiveClientHandler handler;
    mutex lock;
    TCPServer server(commands, &handler, lock, errMsg, 3);

    // Use the first port number that works
    int port = MIN_PORT;
    bool successed = false;
    while (!successed && port <= MAX_PORT) {
        try {
            server.startServer(port);
            successed = true;
        } catch (...) {
            server.closeServer();
            port++;
        }
    }
    // The server will work on another thread
    thread t(&TCPServer::serveClient, &server);

    // Add a new client
    TCPClient client;
    client.connectToServer("127.0.0.1", port);

    for (auto const& [key, value] : IOMap) {
        // Send a message and check server's response
        client.socket_io->returnOutput(key);
        EXPECT_EQ(client.socket_io->getInput(), value);
    }

    // Disconnect and close everything
    client.disconnect();
    server.closeServer();
    t.join();
}

// Test the server with an echo command
TEST(ClientServerTests, ServerUnitTests) {

    // The input and outputs to check in this test
    vector<pair<string, string>> IOMap = {
        {"DECHO Hello world!", "Hello world! Hello world!"},
    };

    // The server will only support a double echo command
    class doubleEchoCommand : public ICommand {
        public:
            string execute(const string& args) const override { return args + " " + args; }
    };
    doubleEchoCommand echo;
    map<string, pair<ICommand*, string>> commands = {{"DECHO", {&echo, ""}}};
    map<string, string> errMsg = {{"Default", ""}};

    testClientServer(IOMap, commands, errMsg);
}

// Test the server and client on the real app
TEST(ClientServerTests, endToEndTests) {

    vector<pair<string, string>> IOMap = {
        {"POST testfile3 AAAAAAA", "201 Created\n"},
        {"get testfile3", "200 Ok\n\nAAAAAAA\n"},
        {"search AAAAAAA", "200 Ok\n\ntestfile3\n"},
        {"POST testfile4 AAAAAAA", "201 Created\n"},
        {"get testfile4", "200 Ok\n\nAAAAAAA\n"},
        {"invalid blah blah", "400 Bad Request\n"},
        {"post", "400 Bad Request\n"},
        {"pOst testfile5 44444AABBBBBBBBBB6666666666 ,,,,,,, hello %^&*((*&^%$#))", "201 Created\n"},
        {"GeT testfile5", "200 Ok\n\n44444AABBBBBBBBBB6666666666 ,,,,,,, hello %^&*((*&^%$#))\n"},
        {"search B", "200 Ok\n\ntestfile5\n"},
        {"SEARCh C", "200 Ok\n\n"},
        {"delete testfile3", "204 No Content\n"},
        {"DELETE testfile4", "204 No Content\n"},
        {"deLETe testfile5", "204 No Content\n"},
        {"get testfileerror", "404 Not Found\n"},
        {"deLETe testfileerror", "404 Not Found\n"}
    };

    RLE comp;
    addCommand add(&comp);
    getCommand get(&comp);
    searchCommand search(&comp);
    deleteCommand deleteC;
    map<string, pair<ICommand*, string>> commands = {
        {"POST", {&add, "201 Created\n"}},
        {"GET", {&get, "200 Ok\n\n"}},
        {"SEARCH", {&search, "200 Ok\n\n"}},
        {"DELETE", {&deleteC, "204 No Content\n"}}
    };

    map<string, string> errMsg = {
        {"Invalid command", "400 Bad Request\n"},
        {"Logical error", "404 Not Found\n"},
        {"Default", "500 Internal Server Error\n"}
    };

    testClientServer(IOMap, commands, errMsg);
}