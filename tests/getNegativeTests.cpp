#include <gtest/gtest.h>
#include "../src/get.h"

TEST(GetSanityTest, TextWithNumericsCompression) {
    // Test the RLE-Decompression for basic text without numeric characters
    EXPECT_EQ(RLEDecompression("5B"), "BBBBB");
    EXPECT_EQ(RLEDecompression("4A3B2C1D2A"), "AAAABBBCCDAA");
    EXPECT_EQ(RLEDecompression("2W3X4Y"), "WWXXXYYYY");
    EXPECT_EQ(RLEDecompression("2a2b2c2d2e2f2g2h2i2j2k2l2m2n2o2p2q2r2s2t2u2v2w2x2y2z"),
            "aabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzz");
    EXPECT_EQ(RLEDecompression("12W1B12W3B24W1B14W"),
            "WWWWWWWWWWWWBWWWWWWWWWWWWBBBWWWWWWWWWWWWWWWWWWWWWWWWBWWWWWWWWWWWWWW");
    EXPECT_EQ(RLEDecompression("4,4 4!1 4a"), ",,,,    !!!! aaaa");
    EXPECT_EQ(RLEDecompression(""), "");
    
    // Test the RLE-Decompression for text with numeric characters
    EXPECT_EQ(RLEDecompression("5\\42A10B10\\6"), "44444AABBBBBBBBBB6666666666");
    EXPECT_EQ(RLEDecompression("4A5\\63B2C1D22\\92A"), "AAAA66666BBBCCD9999999999999999999999AA");
    EXPECT_EQ(RLEDecompression("2W3\\\\4Y"), "WW\\\\\\YYYY");
    EXPECT_EQ(RLEDecompression("1\\\\3\\47A9\\710z"), "\\444AAAAAAA777777777zzzzzzzzzz");
    EXPECT_EQ(RLEDecompression("10\\\\4 5\\23!2\\3"), "\\\\\\\\\\\\\\\\\\\\    22222!!!33"); 
    EXPECT_EQ(RLEDecompression("1\\21\\31\\4"), "234");
    EXPECT_EQ(RLEDecompression("2\\\\1\\5"), "\\\\5");
    EXPECT_EQ(RLEDecompression("2\\ 3\\\t1Z"), "  \t\t\tZ");
    EXPECT_EQ(RLEDecompression("1\\\\1\\71\\8"), "\\78");

    // Test invalid RLE-Decompression inputs for basic text without numeric characters
    EXPECT_THROW(RLEDecompression("0A"), std::invalid_argument);
    EXPECT_THROW(RLEDecompression("3A5!w"), std::invalid_argument);
    EXPECT_THROW(RLEDecompression("Q"), std::invalid_argument);
    EXPECT_THROW(RLEDecompression("2A3"), std::invalid_argument);
    EXPECT_THROW(RLEDecompression("&A"), std::invalid_argument);

    // Test invalid RLE-Decompression inputs for text with numeric characters
    EXPECT_THROW(RLEDecompression("0\\5A"), std::invalid_argument);
    EXPECT_THROW(RLEDecompression("3A\\3"), std::invalid_argument);
    EXPECT_THROW(RLEDecompression("Q33"), std::invalid_argument);
    EXPECT_THROW(RLEDecompression("2A43"), std::invalid_argument);
    EXPECT_THROW(RLEDecompression("4\\&A\\4"), std::invalid_argument);
}

// Initiate and run the tests for the RLE-Decompression 
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}