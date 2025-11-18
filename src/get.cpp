#include <string>
#include "get.h"
#include <stdexcept>

using namespace std;

// Return the RLE-Decompressed text of a compressed input string
string RLEDecompression(const string& input) {
    string output;
    long int n = input.length();
    long int count = 0;
    char ch;
    for (long int i = 0; i < n; ) {
        
        // Extract the number before the digit to know how many times to repeat it
        // The number can be of more than one digit
        while (i < n && isdigit(input[i])) {
            count = count * 10 + (input[i] - '0');
            i++;
        }
        if (count == 0) {
            // If no valid count was found it's an invalid input
            throw invalid_argument("Invalid RLE-Compression code: count cannot be zero or missing.");
        }
        // The following character after the number is the actual character to repeat
        if (i < n) {
            // If the character is an escape character, move to the next character
            if (input[i] == '\\') {
                i++;
            }
        }
        // Now the character to repeat should be present
        if (i < n) {               
            // Append the character 'count' times to the output if we didn't reach the end of the string 
            ch = input[i];
            output.append(count, ch);
            count = 0;
            i++;
        } else {
            // If there's no character after the number it's an invalid input
            throw invalid_argument("Invalid RLE-Compression code: character missing after count or escape character.");
        }
    }
    return output;
}
