#include <gtest/gtest.h>
#include "../src/addCommand.h"

// Test the RLECompression on text without digits
TEST(SanityTests, NoDigitsText) {
    EXPECT_EQ(RLECompression("AAAAAAA"), "7A");
    EXPECT_EQ(RLECompression("AAAABBBCCDAA"), "4A3B2C1D2A");
    EXPECT_EQ(RLECompression("aabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzz"),
                            "a2b2c2d2e2f2g2h2i2j2k2l2m2n2o2p2q2r2s2t2u2v2w2x2y2z2");
    EXPECT_EQ(RLECompression("WWWWWWWWWWWWBWWWWWWWWWWWWBBBWWWWWWWWWWWWWWWWWWWWWWWWBWWWWWWWWWWWWWW"),
                            "12W1B12W3B24W1B14W");
    EXPECT_EQ(RLECompression("Hello, wwworld!"), "He2lo, 3world!");
}

// Init and run all tests
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}