#ifndef SOCKETIO_H
#define SOCKETIO_H

#include "IInputOutput.h"

class SocketInputOutput : public IInputOutput {
    public:
        SocketInputOutput(int sockIn, int sockOut);
        string getInput() const override;
        void returnOutput(const string& output) const override;
    private:
        int sockIn, sockOut;
};

#endif