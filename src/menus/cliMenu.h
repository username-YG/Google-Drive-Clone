#include "IMenu.h"

#include <string>
#include <vector>
using namespace std;

class CLIMenu : public IMenu {
    public:
        vector<string> parse_input(const string& args) const;
        vector<string> nextCommand() const;
        void displayOutput(const string& output) const;
};
