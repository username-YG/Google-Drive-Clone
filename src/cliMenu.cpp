#include <iostream>
#include <string>
#include <vector>
#include "iMenu.cpp"

using namespace std;

class CLIMenu : public IMenu {
public:
    vector<string> parse_input(const string& args) {
        vector<string> arguments(3);

        // Assigning default values
        arguments[0] = args;
        arguments[1] = "";
        arguments[2] = "";

        // Finding the index of the first space
        size_t index_first = args.find(' ');

        // If a first space was found, split the argument into 2 parts
        if (index_first != string::npos) {
            // Update the first argument to be the substring from the start of the string until the first space
            arguments[0] = args.substr(0, index_first);
            if (index_first < args.length() - 1) {
                // Update the second argument to be the substring after the first space and untill the end of the string
                arguments[1] = args.substr(index_first + 1);
                size_t index_second = args.find(' ', index_first + 1);
                // If a second space was found, split the argument into three parts
                if (index_second != string::npos) {
                    // Update the second argument to be the substring between the first and second spaces
                    arguments[1] = args.substr(index_first + 1, index_second - index_first - 1);
                    if (index_second < args.length() - 1) {
                        // Update the third argument to be the substring after the second space and untill the end of the string
                        arguments[2] = args.substr(index_second + 1);
                    }
                }
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