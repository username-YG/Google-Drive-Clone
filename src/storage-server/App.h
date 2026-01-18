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
        map<string, pair<ICommand*, string>> commands;
        map<string, string> errMsg;
        mutex& lock;
        void iteration();
        static vector<string> parse_input(const string& args);

    public:
        App(
            IInputOutput* IO,
            map<string, pair<ICommand*, string>> commands,
            mutex& lock,
            map<string, string> errMsg = {{"Default", ""}}
        );
        ~App();
        void run();

        friend class AppClIRleTests_EndToEndTests_Test;
        friend class ParsingTests_AllTests_Test;
};

#endif