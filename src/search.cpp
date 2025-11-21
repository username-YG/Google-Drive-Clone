#include <string>
#include "get.h"
#include <iostream>
#include <fstream> 
#include <cstdlib> //used for std::getenv
#include <filesystem> 
#include <vector>
#include <stdexcept>

using string = std::string;
namespace fs = std::filesystem;

bool IsContainsContent(const string& fileContent, const string& content) {
    // if fileContent contains content, return true; otherwise, return false
    return fileContent.find(content) != string::npos;
}

// Search for files containing the given content
std::vector<string> SearchFiles(const string& content){
    // const char* path_str = std::getenv("SEARCH_PATH");
    const char* path_str = "C:\\Users\\eitan\\OneDrive\\Desktop\\תואר\\שנה ג\\סמסטר א\\תכנות מתקדם\\פרוייקט\\תרגיל 1\\Google-Drive-Project-ASP\\tests\\Files";
    std::vector<string> results;
    if (path_str == nullptr) {
        throw runtime_error("Environment variable SEARCH_PATH is not set.");
    }
    string root_path = path_str;

    try {
        // recursive iterator to go through all files and directories under root_path
        for (const auto& entry : fs::recursive_directory_iterator(root_path)) {
            
            // check if the entry is a regular file and if it contains the given content
            // switch the if to the following 3 lines after pulling new structere
            // if (entry.is_regular_file() && IsContainsContent(RLEDecompression(entry.path().filename().string()), content)) {
            //     results.push_back(entry.path().filename().string());
            // }
            if (entry.is_regular_file()) {
                // Open the file
                std::ifstream file(entry.path());
                if (!file.is_open()) continue; // skip if can't open

                // Read the entire file content into a string
                std::string fileContent((std::istreambuf_iterator<char>(file)),
                                        std::istreambuf_iterator<char>());

                // Decompress the content
                std::string decompressedContent = RLEDecompression(fileContent);

                // Check if the decompressed content contains the search string
                if (IsContainsContent(decompressedContent, content)) {
                    results.push_back(entry.path().filename().string());
                }
            }
        }
    } catch (const fs::filesystem_error& e) {
        //std::cerr << "fileSystem error " << e.what() << std::endl;
    }

    for (const auto& filename : results) {
        std::cout << filename << std::endl;
    }
     return results;
}

int main(int argc, char **argv) {
    try {
        std::vector<string> files = SearchFiles("");
        for (const auto& f : files) {
            std::cout << f << std::endl;
        }
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
    }
}