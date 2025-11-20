#include "ICommand.cpp"
#include "RLE.h"

#include <string>
#include <vector>

using namespace std;

class addCommand: public ICommand {
    public:
        string execute(const string& args) const override {
            return string();
        }
};