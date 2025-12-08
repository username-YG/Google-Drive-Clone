#ifndef TCPSERVER_H
#define TCPSERVER_H

#include "IServer.h"
#include "../clientHandlers/IClientHandler.h"
#include "../InputOutputs/SocketInputOutput.h"

#include <map>
#include <mutex>

#define MAX_CLIENTS 3

class TCPServer : public IServer {
    public:
        TCPServer(map<string, pair<ICommand*, string>> commands, IClientHandler* handler, mutex& lock, map<string, string> errMsg);
        void startServer(int port) override; // The port the server listens to
        void serveClient() const override;
        void closeServer() const override;
    private:
        int serverSocket;
        map<string, pair<ICommand*, string>> commands; // Commands supported by the server
        IClientHandler* handler; // A function to handle new users
        mutex& lock; // A shared lock across all clients
        map<string, string> errMsg; // Error messages for exceptions
};

#endif