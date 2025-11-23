#ifndef RLE_H
#define RLE_H

#include "ICompression.h"

class RLE : public ICompression {
    public:
        string compress(const string& str) const override;
        string decompress(const string& str) const override;
};

#endif