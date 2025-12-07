#ifndef APP_H
#define APP_H

#include "InputOutputs/IInputOutput.h"
#include "commands/ICommand.h"
#include <map>
#include <string>
#include <vector>
#include <mutex>

using namespace std;

class App {
    private:
        IInputOutput* IO;
        map<string, ICommand*> commands;
        string (*outputHandler)(string&, string&, string&);
        mutex& lock;
        void iteration();
        static vector<string> parse_input(const string& args);

    public:
        App(
            IInputOutput* IO,
            map<string, ICommand*> commands,
            mutex& lock,
            // By default just return the output as it is
            string (*outputHandler)(string&, string&, string&) = [](string&, string& output, string&) { return output; }
        );
        ~App();
        void run();

        friend class AppClIRleTests_EndToEndTests_Test;
        friend class ParsingTests_AllTests_Test;
};

#endif