#ifndef ICOMPRESSION_H
#define ICOMPRESSION_H

#include <string>
using namespace std;

class ICompression {
    public:
        virtual string compress(const string& str) const = 0;
        virtual string decompress(const string& str) const = 0;
};

#endif