#include "App.h"
#include <stdexcept>

App::App(
    IInputOutput* IO,
    map<string, pair<ICommand*, string>> commands,
    mutex& lock,
    map<string, string> errMsg
    ) : IO(IO), commands(commands), lock(lock), errMsg(errMsg) {}
App::~App() { delete IO; }

void App::iteration() {

    // Get command name and args
    string input = IO->getInput();
    vector<string> command = parse_input(input);
    string name = command[0];
    string args = command[1];

    // Convert command name to uppercase
    for (char &c : name) c = toupper(c);
    string output;

    try {
        // Check if it's a real command
        if (commands.count(name)) {
            lock_guard<mutex> ulock(lock);
            output = commands[name].second + commands[name].first->execute(args);
        } else {
            throw runtime_error("Invalid command: command doesn't exist");
        }
    } catch (const exception& exc) {
        // Search error title in map
        string msg = exc.what();
        string title = msg.substr(0, msg.find(':'));
        output = errMsg.count(title) ? errMsg[title] : errMsg["Default"];
    }

    // Return output
    IO->returnOutput(output);

}

void App::run() {
    // The app runs forever
    while (true) {
        iteration();
    }
}

vector<string> App::parse_input(const string& args) {
    vector<string> arguments(2);

    // Assigning default values
    arguments[0] = args;
    arguments[1] = "";

    // Finding the index of the first space
    size_t index = args.find(' ');

    // If a space was found, split the argument into 2 parts
    if (index != string::npos) {
        // Update the first argument to be the substring from the start of the string until the first space
        arguments[0] = args.substr(0, index);
        if (index < args.length() - 1) {
            // Update the second argument to be the substring after the space and until the end of the string
            arguments[1] = args.substr(index + 1);
        }
    }
    return arguments;
}