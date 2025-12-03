#include "App.h"

App::App(IInputOutput* IO, map<string, ICommand*> commands) : IO(IO), commands(commands) {}

void App::iteration() {
    string input = IO->getInput();
    vector<string> command = parse_input(input);
    try {
        // Ensure this is a real command
        if (commands.find(command[0]) != commands.end()) {
            string output = commands[command[0]]->execute(command[1]);
            IO->returnOutput(output);
        }
    } catch (...) {}
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