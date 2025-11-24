#ifndef IMENU_H
#define IMENU_H

#include <vector>
#include <string>

using namespace std;

class IMenu {
    public:
        // Next command returns the command name and args
        virtual vector<string> nextCommand() const = 0;
        virtual void displayOutput(const string& output) const = 0;
};

#endif