#include <string>
#include <vector>

class ICommand {
    // The function gets a vector of arguments and returns output
    virtual std::string execute(std::vector<std::string> args) const = 0;
};