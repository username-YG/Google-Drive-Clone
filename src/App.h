#ifndef APP_H
#define APP_H

#include "InputOutput/IInputOutput.h"
#include "commands/ICommand.h"
#include <map>
#include <string>
#include <vector>

class App {
    private:
        IInputOutput* IO;
        map<string, ICommand*> commands;
        void iteration();
        static vector<string> parse_input(const string& args);

    public:
        App(IInputOutput* IO, map<string, ICommand*> commands);
        void run();

        friend class AppClIRleTests_EndToEndTests_Test;
        friend class ParsingTests_AllTests_Test;
};

#endif