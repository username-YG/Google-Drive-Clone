#include "getCommand.h"
#include "../compressions/ICompression.h"

#include <stdexcept>
#include <vector>
#include <fstream>
#include <iostream>

getCommand::getCommand(ICompression* comp) : comp(comp) {}

void getCommand::isValidFilename(const string& filename) const {
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

string getCommand::getFileContent(const string& filename, const string& path) const {
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

string getCommand::execute(const string& args) const {
    string filename = args;
    // Checking the validity of the filename
    isValidFilename(filename);
    // Getting the file's content from the specified environment variable path
    string fileContent = getFileContent(filename, getenv("APP_PATH"));
    // Decompressing the RLE compressed content of the file
    string decompressedContent = comp->decompress(fileContent);
    // Returning the original decompressed content
    return decompressedContent + "\n";
}