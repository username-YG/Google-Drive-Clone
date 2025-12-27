#ifndef SOCKETIO_H
#define SOCKETIO_H

#include "IInputOutput.h"
#define BUF_SIZE 1024

class SocketInputOutput : public IInputOutput {
    public:
        SocketInputOutput(int sockIn, int sockOut);
        ~SocketInputOutput();
        string getInput() const override;
        void returnOutput(const string& output) const override;
    private:
        int sockIn, sockOut;
};

#endif