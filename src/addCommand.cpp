#include <string>
using namespace std;

// Compress a string using RLE compression
string RLECompression(const string& str) {

    // Counts how many times a char appears consecutively
    size_t count = 1;
    string output;

    // Walk through the string char by char
    for (size_t i = 0; i < str.length(); i++) {

        // If the current and next chars equal, update the count
        if (i + 1 < str.length() && str[i] == str[i + 1]) {
            count++;
        } else {
            char currentChar = str[i];

            // Escape digits and '\\' to avoid confusion with counts and escape chars
            string escape = (isdigit(currentChar) || currentChar == '\\') ? "\\" : "";

            // Append char and count and reset count
            output += to_string(count) + escape + currentChar;
            count = 1;
        }
    }

    return output;
}