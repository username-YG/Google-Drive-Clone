#include <iostream>
#include <string>
#include <vector>
#include "IMenu.h"

using namespace std;

class CLIMenu : public IMenu {
public:
    vector<string> parse_input(const string& args) {
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
    
    vector<string> nextCommand() {
        string input;
        // Get the next command from the user
        getline(std::cin, input);
        // Parse the input into arguments
        vector<string> args_vector = parse_input(input);
        return args_vector;
    }

    void displayOutput(const string& output) {
        // Display the output to the screen
        cout << output << endl;   
    }
};
