#ifndef ISERVER_H
#define ISERVER_H

class IServer {
    public:
        virtual void startServer(int port) = 0;
        virtual void serveClient() const = 0;
        virtual void closeServer() const = 0;
};

#endif