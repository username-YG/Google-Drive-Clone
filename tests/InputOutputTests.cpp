#include <gtest/gtest.h>
#include "../storage-server/InputOutputs/StreamInputOutput.h"
#include "../src/storage-server/InputOutputs/SocketInputOutput.h"
#include <map>
#include <sys/socket.h>

vector<string> texts = {
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore  laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679",
    "This string contains more than 1024 chars. This string contains more than 1024 chars. This string contains more than 1024 chars. This string contains more than 1024 chars. This string contains more than 1024 chars. This string contains more than 1024 chars. This string contains more than 1024 chars. This string contains more than 1024 chars. This string contains more than 1024 chars. This string contains more than 1024 chars. This string contains more than 1024 chars. This string contains more than 1024 chars. This string contains more than 1024 chars. This string contains more than 1024 chars. This string contains more than 1024 chars. This string contains more than 1024 chars. This string contains more than 1024 chars. This string contains more than 1024 chars. This string contains more than 1024 chars. This string contains more than 1024 chars. This string contains more than 1024 chars. This string contains more than 1024 chars. This string contains more than 1024 chars. This string contains more than 1024 chars."
    ""
};

// Testing the IO from stream functionality
TEST(IOTests, StreamTests) {
    for (const auto& text : texts) {
        istringstream in(text);
        ostringstream out;
        StreamInputOutput streamIO(in, out);
        EXPECT_EQ(streamIO.getInput(), text);
        streamIO.returnOutput(text);
        EXPECT_EQ(out.str(), text);
    }
}

// Testing the IO from socket functionality
TEST(IOTests, SocketTests) {
    // Create two connected sockets for testing purposes
    // AF_UNIX protocol means local communication
    int testSock[2];

    int status = socketpair(AF_UNIX, SOCK_STREAM, 0, testSock);
    if (status < 0) { return; }

    SocketInputOutput socketIO(testSock[0], testSock[1]);
    for (const auto& text : texts) {
        socketIO.returnOutput(text);
        EXPECT_EQ(socketIO.getInput(), text);
    }

    close(testSock[0]);
    close(testSock[1]);
}