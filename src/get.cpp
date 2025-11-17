#include <string>
#include "get.h"

using namespace std;

string RLEDecompression(const string& input) {
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
        // The following character after the number is the actual character to repeat
        if (i < n) {
            char ch = input[i];
            output.append(count, ch);
            i++;
        }
    }

    return output;
}