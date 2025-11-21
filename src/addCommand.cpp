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
        string execute(const string& args) const override {return string();}

    private:
        void saveToFile(const string& pathStr, const string& content) {
            // Throw error if the file exists
            if (ifstream(pathStr).is_open()) {
                throw invalid_argument("Invalid command arguments: file already exists.");
            }
            // Create the parent directory and write to file
            filesystem::path path = pathStr;
            filesystem::create_directories(path.parent_path());
            ofstream(path) << content;
        }

        friend class AddUnitTests_SaveToFileSanityTest_Test;
        friend class AddUnitTests_SaveToFileEdgeTest_Test;
};