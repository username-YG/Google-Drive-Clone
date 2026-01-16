#ifndef IIO_H
#define IIO_H

#include <string>
using namespace std;

class IInputOutput {
    public:
        virtual string getInput() const = 0;
        virtual void returnOutput(const string& output) const = 0;
};

#endif