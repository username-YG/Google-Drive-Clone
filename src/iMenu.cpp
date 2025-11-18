#include <vector>
#include <string>

using namespace std;

class IMenu {
public:
    // Defining the interface methods
    virtual vector<string> nextCommand() = 0;
    virtual void displayOutput(const string& output) = 0;
};