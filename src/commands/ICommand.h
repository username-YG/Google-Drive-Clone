#ifndef ICOMMAND_H
#define ICOMMAND_H

#include <string>
#include <vector>

class ICommand {
    public:
        // The function gets a vector of arguments and returns output
        virtual std::string execute(const std::string& args) const = 0;
};

#endif