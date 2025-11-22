#include "ICommand.cpp"
#include <string>
#include "RLE.h"
#include <iostream>
#include <fstream>
#include <cstdlib>
#include <filesystem>
#include <vector>
#include <stdexcept>
#include "searchCommand.h"

using namespace std;

class searchCommand: public ICommand {
    public:
        string execute(const string& args) const {
            const char* path_c_str = std::getenv("SEARCH_PATH");
            const std::vector<string> foundFiles = SearchFilesFromPath(path_c_str, args);
            for (const auto& file : foundFiles)
            {
                std::cout << file << std::endl;
            }
        }
};

using string = std::string;
namespace fs = std::filesystem;

bool IsContainsContent(const string& fileContent, const string& content) {
    // if fileContent contains content, return true; otherwise, return false
    return fileContent.find(content) != string::npos;
}

// Search for files containing the given content
std::vector<string> SearchFilesFromPath(const string& root_path, const string& content) {

    if (root_path.empty()) {
        throw std::runtime_error("Root path cannot be empty.");
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
                std::string decompressedContent = RLEDecompression(fileContent);

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
