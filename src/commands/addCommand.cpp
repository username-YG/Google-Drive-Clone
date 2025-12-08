#include "addCommand.h"
#include "../compressions/ICompression.h"

#include <stdexcept>
#include <fstream>
#include <filesystem>

addCommand::addCommand(ICompression* comp) : comp(comp) {}

string addCommand::execute(const string& args) const {

    // Get filename and content from args and path from environment variable
    vector<string> parsed = parseArgs(args);
    string filename = parsed[0];
    string content = parsed[1];
    string path = getenv("APP_PATH") ? getenv("APP_PATH") : "";

    saveToFile(path + "/" + filename, comp->compress(content));
    return string();
}

void addCommand::saveToFile(const string& pathStr, const string& content) const {
    // Throw error if the file exists
    if (ifstream(pathStr).is_open()) {
        throw invalid_argument("Logical error: file already exists.");
    }
    // Create the parent directory and write to file
    filesystem::path path = pathStr;
    filesystem::create_directories(path.parent_path());
    ofstream(path) << content;
}

vector<string> addCommand::parseArgs(const string& args) const {
    size_t pos = args.find(' ');
    // No space and nothing before space is invalid
    if (pos == string::npos || pos == 0) {
        throw invalid_argument("Invalid command: not enough arguments.");
    }
    // The structure is "POST [file name] [text]"
    string filename = args.substr(0, pos);
    string content = args.substr(pos + 1);
    return vector<string>({filename, content});
}