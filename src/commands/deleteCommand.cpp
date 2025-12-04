#include "deleteCommand.h"
#include <stdexcept>
#include <string>
#include <filesystem>

deleteCommand::deleteCommand() {}

void deleteCommand::isValidFile(const string& filename) const {
    // Checking if the filename is an empty string
    if (filename.empty()) {
        // Throwing an exception if the filename is empty
        throw invalid_argument("Filename cannot be empty.");
    }

    // Checking if filename contains a blank space
    if (filename.find(' ') != string::npos) {
        // Throwing an exception if a blank space is found in the filename
        throw invalid_argument("Filename cannot contain blank spaces.");
    }

    // Checking if the file exists
    if (!filesystem::exists(filename)) {
        // Throwing an exception if the file does not exist
        throw runtime_error("File does not exist: " + filename);
    }
}

void deleteCommand::deleteFile(const string& filename) const {
    // Making sure first the filename is valid and its existence
    isValidFile(filename);

    // Deleting the file
    if (!filesystem::remove(filename)) {
        // Throwing an exception if the file could not be deleted
        throw runtime_error("Could not delete file: " + filename);
    }
}

string deleteCommand::execute(const string& args) const {
    string filename = args;
    deleteFile(filename);
    return string();
}