#include "ICommand.h"
#include "RLE.h"

#include <string>
#include <vector>

using namespace std;

class searchCommand: public ICommand {
    public:
        string execute(const string& args) const override {
            return string();
        }
};