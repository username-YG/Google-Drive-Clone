#include <gtest/gtest.h>
#include "../src/get.h"

// Test the RLE-Decompression for basic text without numeric characters
TEST(GetSanityTest, BasicTextCompression) {
    EXPECT_EQ(RLEDecompression("5B"), "BBBBB");
    EXPECT_EQ(RLEDecompression("4A3B2C1D2A"), "AAAABBBCCDAA");
    EXPECT_EQ(RLEDecompression("2W3X4Y"), "WWXXXYYYY");
    EXPECT_EQ(RLEDecompression("2a2b2c2d2e2f2g2h2i2j2k2l2m2n2o2p2q2r2s2t2u2v2w2x2y2z"),
            "aabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzz");
    EXPECT_EQ(RLEDecompression("12W1B12W3B24W1B14W"),
            "WWWWWWWWWWWWBWWWWWWWWWWWWBBBWWWWWWWWWWWWWWWWWWWWWWWWBWWWWWWWWWWWWWW");
    EXPECT_EQ(RLEDecompression("4,4 4!1 4a"), ",,,,    !!!! aaaa");
}

// Initiate and run the tests for the RLE-Decompression 
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}