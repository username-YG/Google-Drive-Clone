#include "deleteCommand.h"
#include <stdexcept>
#include <string>
#include <filesystem>

deleteCommand::deleteCommand() {}

void deleteCommand::isValidFile(const string& filename, const string& path) const {
    // Checking if the filename is an empty string
    if (filename.empty()) {
        // Throwing an exception if the filename is empty
        throw invalid_argument("Invalid command: filename cannot be empty.");
    }

    // Checking if filename contains a blank space
    if (filename.find(' ') != string::npos) {
        // Throwing an exception if a blank space is found in the filename
        throw invalid_argument("Invalid command: filename cannot contain blank spaces.");
    }

    // Checking if the file exists
    if (!filesystem::exists(path + "/" + filename)) {
        // Throwing an exception if the file does not exist
        throw runtime_error("Logical error: file does not exist: " + filename);
    }
}

void deleteCommand::deleteFile(const string& filename, const string& path) const {
    // Making sure first the filename is valid and its existence
    isValidFile(filename, path);

    // Deleting the file
    if (!filesystem::remove(path + "/" + filename)) {
        // Throwing an exception if the file could not be deleted
        throw runtime_error("Could not delete file: " + filename);
    }
}

string deleteCommand::execute(const string& args) const {
    // Extracting the filename from the arguments
    string filename = args;
    // Getting the path from the environment variable
    string path = getenv("APP_PATH") ? getenv("APP_PATH") : "";
    // Deleting the specified file
    deleteFile(filename, path);
    // Returning an empty string because there is no output for delete command
    return string();
}