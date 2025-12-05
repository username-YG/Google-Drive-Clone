#include "clients/TCPClient.h"

int main(int argc, char *argv[]) {

    // Ensure enough args
    if (argc < 2) return 0;

    try {
        // Start client
        string IP = argv[1];
        int port = stoi(argv[2]);
        TCPClient client;
        client.connectToServer(IP, port);
        client.useServer();

        // Properly disconnect if something stops or crashes
        client.disconnect();
    } catch (...) {}
}