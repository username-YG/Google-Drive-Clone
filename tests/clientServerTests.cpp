#include <gtest/gtest.h>
#include <thread>

#include "../src/servers/TCPServer.h"
#include "../src/clientHandlers/naiveClientHandler.h"
#include "../src/clients/TCPClient.h"
#include "../src/commands/addCommand.h"
#include "../src/commands/getCommand.h"
#include "../src/commands/searchCommand.h"
#include "../src/compressions/RLE.h"

#define MIN_PORT 49152
#define MAX_PORT 65535

void testClientServer(vector<pair<string, string>> IOMap, map<string, ICommand*> commands) {

    NaiveClientHandler handler;
    TCPServer server(commands, &handler);

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
    map<string, ICommand*> commands = {{"DECHO", &echo}};

    testClientServer(IOMap, commands);
}

// Test the server and client on the real app
TEST(ClientServerTests, endToEndTests) {

    vector<pair<string, string>> IOMap = {
        {"POST testfile3 AAAAAAA", ""},
        {"get testfile3", "AAAAAAA\n"},
        {"POST testfile4 AAAAAAA", ""},
        {"get testfile4", "AAAAAAA\n"},
        {"pOst testfile5 44444AABBBBBBBBBB6666666666 ,,,,,,, hello %^&*((*&^%$#))", ""},
        {"GeT testfile5", "44444AABBBBBBBBBB6666666666 ,,,,,,, hello %^&*((*&^%$#))\n"},
        {"search B", "testfile5\n"},
        {"SEARCh C", ""}
    };

    RLE comp;
    addCommand add(&comp);
    getCommand get(&comp);
    searchCommand search(&comp);
    map<string, ICommand*> commands = {
        {"POST", &add},
        {"GET", &get},
        {"SEARCH", &search},
    };

    testClientServer(IOMap, commands);
}