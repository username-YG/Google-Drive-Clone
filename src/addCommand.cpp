#include <string>
using namespace std;

// Compress a string using RLE compression
string RLECompression(const string& str) {

    // The compressed string we will build char by char
    string compressedStr = "";

    // Counts how many times a char appears consecutively
    // Initialized to 1 since each char appears at least once
    int dupCount = 1;

    // Walk through the string char by char
    for (int i = 0; i < str.length(); i++) {
        char currentChar = str[i];

        // Check if the next char exists
        if (i + 1 < str.length()) {
            char nextChar = str[i + 1];
            // If the current and next chars equal, update the duplication count
            if (currentChar == nextChar) {
                dupCount++;
                continue;
            }
        }

        // Escape digits to avoid confusion with dup counters
        // Escape '\\' to to avoid confusion with escape characters
        string escape = "";
        if (isdigit(currentChar) || currentChar == '\\') {
            escape = "\\";
        }

        // When a sequence ends, append its char and how many times it's duplicated 
        compressedStr += to_string(dupCount) + escape + currentChar;

        // Reset the duplication count back to 1
        dupCount = 1;
    }
    
    return compressedStr;
}