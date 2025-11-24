#include "searchCommand.h"
#include "../compressions/ICompression.h"

#include <iostream>
#include <fstream>
#include <cstdlib>
#include <filesystem>
#include <stdexcept>

searchCommand::searchCommand(ICompression* comp) : comp(comp) {}

string searchCommand::execute(const string& args) const {
    const char* path_c_str = getenv("APP_PATH") ? getenv("APP_PATH") : "";
    const vector<string> foundFiles = SearchFilesFromPath(path_c_str, args);
    string output;
    for (size_t i = 0; i < foundFiles.size(); i++)
    {
        output += foundFiles[i];
        // Add spaces filenames and enter at the end
        output += (i + 1 == foundFiles.size()) ? "\n" : " ";
    }
    return output;
}

namespace fs = filesystem;

bool searchCommand::IsContainsContent(const string& fileContent, const string& content) const {
    // if fileContent contains content, return true; otherwise, return false
    return fileContent.find(content) != string::npos;
}

// Search for files containing the given content
vector<string> searchCommand::SearchFilesFromPath(const string& root_path, const string& content) const {

    if (content == "" || root_path.empty()) {
        throw runtime_error("Content and root path must not be empty.");
    }

    vector<string> results;

    try {
        // check the directory exists
        if (!fs::exists(root_path) || !fs::is_directory(root_path)) {
            throw runtime_error("Path does not exist or is not a directory: " + root_path);
        }

        // recursive iterator to go through all files and directories under root_path
        for (const auto& entry : fs::recursive_directory_iterator(root_path)) {

            if (entry.is_regular_file()) {

                // open the file
                ifstream file(entry.path());

                // if didnt open
                if (!file.is_open()) {
                    cerr << "Warning: Could not open file " << entry.path().string() << endl;
                    continue;
                }

                // take the content of the file
                string fileContent((istreambuf_iterator<char>(file)),
                                        istreambuf_iterator<char>());

                // decompress the compressed content
                string decompressedContent = comp->decompress(fileContent);

                // check if the file contains the requested content
                if (IsContainsContent(decompressedContent, content)) {
                    results.push_back(entry.path().filename().string());
                }
            }
        }
    } catch (const fs::filesystem_error& e) {
        throw runtime_error("FileSystem error during search: " + string(e.what()));
    }

    return results;
}
