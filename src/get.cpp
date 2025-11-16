#include <string>
#include "get.h"
#include <stdexcept>

using namespace std;

// Return the RLE-Decompressed text of a compressed input string
string RLEDecompression(string input) {
    string output;
    int n = input.length();
    for (int i = 0; i < n; ) {
        int count = 0;
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
            char ch = input[i];
            output.append(count, ch);
            i++;
        } else {
            // If there's no character after the number it's an invalid input
            throw invalid_argument("Invalid RLE-Compression code: character missing after count.");
        }
    }

    return output;
}