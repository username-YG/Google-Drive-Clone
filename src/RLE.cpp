#include <string>
#include <stdexcept>

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

// Return the RLE-Decompressed text of a compressed input string
string RLEDecompression(const string& input) {
    string output;
    size_t n = input.length(), count = 0, index = 0;

    while (index < n) {
        // Extract the number before the digit to know how many times to repeat it
        // The number can be of more than one digit
        while (index < n && isdigit(input[index])) {
            count = count * 10 + (input[index] - '0');
            index++;
        }
        if (count == 0) {
            // If no valid count was found it's an invalid input
            throw invalid_argument("Invalid RLE-Compression code: count cannot be zero or missing.");
        }
        // The following character after the number is the actual character to repeat
        if (index >= n) {
            // If there's no character after the number it's an invalid input
            throw invalid_argument("Invalid RLE-Compression code: character missing after count or escape character.");
        }
        // If the character is an escape character, move to the next character
        if (input[index] == '\\') {
            index++;
            if (index >= n) {
                // If there's no character after the number it's an invalid input
                throw invalid_argument("Invalid RLE-Compression code: character missing after count or escape character.");
            }
            if (input[index] != '\\' && !isdigit(input[index])) {
                // If the character to repeat is a digit and not escaped, it's an invalid input
                throw invalid_argument("Invalid RLE-Compression code: escape character only for numeric characters or itself.");
            }
        }
        // Now the character to repeat should be present              
        // Append the character 'count' times to the output if we didn't reach the end of the string 
        output.append(count, input[index]);
        count = 0;
        index++;
    }
    return output;
}
