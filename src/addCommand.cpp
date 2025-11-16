#include <string>
using namespace std;

// Compress a string using RLE compression
string RLECompression(string str) {

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

        // When a sequence ends, add the char and how many times it's duplicated to the compressed string 
        compressedStr = compressedStr + to_string(dupCount) + currentChar;

        // Reset the duplication count back to 1
        dupCount = 1;
    }
    return compressedStr;
}