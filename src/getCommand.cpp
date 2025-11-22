#include "ICommand.cpp"
#include "RLE.h"
#include <stdexcept>
#include <string>
#include <vector>
#include <fstream>
#include <iostream>

using namespace std;

class getCommand: public ICommand {
    friend class FilenameValiditySanityTest_FilenameValidityCheck_Test;
    friend class FilenameValidityNegativeTest_FilenameValidityCheck_Test;
    friend class GettingFileContentSanityTest_GettingFileContent_Test;
    friend class GettingFileContentNegativeTest_GettingFileContent_Test;

    private:
        void isValidFilename(const string& filename) const {
            // Checking if the filename is an empty string
            if (filename.empty()) {
                // Throwing an exception if the filename is empty
                throw invalid_argument("Filename cannot be empty.");
            }

            // Checking if filename contains blank spaces
            if (filename.find(' ') != string::npos) {
                // Throwing an exception if blank spaces are found in the filename
                throw invalid_argument("Filename cannot contain blank spaces.");
            }
        }

        string getFileContent(const string& filename, const string& path) const {
            // Constructing the full file path
            string fullPath = path + "/" + filename;
            // Opening the file to extract its content
            ifstream file(fullPath);

            // Checking if the file was opened successfully, if not - throwing an exception
            if (!file) {
                throw runtime_error("Could not open file: " + fullPath);
            }

            // Reading the file content into a string and returning it
            return string((istreambuf_iterator<char>(file)), istreambuf_iterator<char>());
        }

    public:
        string execute(const string& args) const override {
            string filename = args;
            // Checking the validity of the filename
            isValidFilename(filename);
            // Getting the file's content from the specified environment variable path
            string fileContent = getFileContent(filename, getenv("GET_PATH"));
            // Decompressing the RLE compressed content of the file
            string decompressedContent = RLEDecompression(fileContent);
            // Returning the original decompressed content
            return decompressedContent;
        }
};