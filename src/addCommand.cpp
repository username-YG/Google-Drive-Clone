#include "ICommand.cpp"
#include "RLE.h"

#include <string>
#include <vector>
#include <stdexcept>
#include <fstream>
#include <filesystem>

using namespace std;

class addCommand: public ICommand {
    public:
        string execute(const string& args) const override {
            // Get filename and content from args and path from environment variable
            vector<string> parsed = parseArgs(args);
            string filename = parsed[0];
            string content = parsed[1];
            string path = getenv("APP_PATH") ? getenv("APP_PATH") : "";

            
            //saveToFile(path + filename, RLECompression(content));
            return RLECompression(content);
        }

    private:
        void saveToFile(const string& pathStr, const string& content) const {
            // Throw error if the file exists
            if (ifstream(pathStr).is_open()) {
                throw invalid_argument("Invalid command arguments: file already exists.");
            }
            // Create the parent directory and write to file
            filesystem::path path = pathStr;
            filesystem::create_directories(path.parent_path());
            ofstream(path) << content;
        }

        vector<string> parseArgs(const string& args) const {
            size_t pos = args.find(' ');
            // No space and nothing before space is invalid
            if (pos == string::npos || pos == 0) {
                throw invalid_argument("Invalid command arguments: not enough arguments.");
            }
            // The structure is "add [file name] [text]"
            string filename = args.substr(0, pos);
            string content = args.substr(pos + 1);
            return vector<string>({filename, content});
        }

        // Test classes are allowed to access private functions
        friend class AddUnitTests_SaveToFileSanityTest_Test;
        friend class AddUnitTests_SaveToFileEdgeTest_Test;
        friend class AddUnitTests_ParseingTest_Test;
};