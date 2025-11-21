#ifndef RLE_H
#define RLE_H

#include <string>
using namespace std;

// Compress a string using RLE compression
string RLECompression(const string& str);

// Return the RLE-Decompressed text of a compressed input string
string RLEDecompression(const string& input);

#endif
