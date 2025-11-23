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
    for (const auto& file : foundFiles)
    {
        output += file + "\n";
    }
    return output;
}

using string = std::string;
namespace fs = std::filesystem;

bool searchCommand::IsContainsContent(const string& fileContent, const string& content) const {
    // if fileContent contains content, return true; otherwise, return false
    return fileContent.find(content) != string::npos;
}

// Search for files containing the given content
std::vector<string> searchCommand::SearchFilesFromPath(const string& root_path, const string& content) const {

    if (content == "" || root_path.empty()) {
        throw std::runtime_error("Content and root path must not be empty.");
    }

    std::vector<string> results;

    try {
        // check the directory exists
        if (!fs::exists(root_path) || !fs::is_directory(root_path)) {
            throw std::runtime_error("Path does not exist or is not a directory: " + root_path);
        }

        // recursive iterator to go through all files and directories under root_path
        for (const auto& entry : fs::recursive_directory_iterator(root_path)) {

            if (entry.is_regular_file()) {

                // open the file
                std::ifstream file(entry.path());

                // if didnt open
                if (!file.is_open()) {
                    std::cerr << "Warning: Could not open file " << entry.path().string() << std::endl;
                    continue;
                }

                // take the content of the file
                std::string fileContent((std::istreambuf_iterator<char>(file)),
                                        std::istreambuf_iterator<char>());

                // decompress the compressed content
                std::string decompressedContent = comp->decompress(fileContent);

                // check if the file contains the requested content
                if (IsContainsContent(decompressedContent, content)) {
                    results.push_back(entry.path().filename().string());
                }
            }
        }
    } catch (const fs::filesystem_error& e) {
        throw std::runtime_error("FileSystem error during search: " + std::string(e.what()));
    }

    return results;
}
