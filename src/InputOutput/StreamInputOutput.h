#ifndef STREAMIO_H
#define STREAMIO_H

#include "IInputOutput.h"
#include <iostream>

class StreamInputOutput : public IInputOutput {
    public:
        // The default streams are cin and cout (CLI)
        StreamInputOutput(istream& in = cin, ostream& out = cout);
        string getInput() const;
        void returnOutput(const string& output) const;
    private:
        // Streams for input and output
        istream& in;
        ostream& out;
};

#endif