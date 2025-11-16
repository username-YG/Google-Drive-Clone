#include <string>
using namespace std;

string RLECompression(string text) {
    int dupCount = 1;
    char prevChar = text[0];

    string compressedText = "";
    for (int i = 1; i < text.length(); i++) {
        char currentChar = text[i];
        if (prevChar == currentChar) {
            dupCount++;
            if (i == text.length() - 1) {
                compressedText = compressedText + to_string(dupCount) + prevChar;
            }
        } else {
            compressedText = compressedText + to_string(dupCount) + prevChar;
            prevChar = currentChar;
            dupCount = 1;
        }
    }
    
    return compressedText;
}