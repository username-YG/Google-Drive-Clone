#include <gtest/gtest.h>
#include "../src/RLE.h"

// Test the RLECompression on strings without digits
TEST(RLECompressSanityTests, NoDigitsStrings) {
    EXPECT_EQ(RLECompression("AAAAAAA"), "7A");
    EXPECT_EQ(RLECompression("AAAABBBCCDAA"), "4A3B2C1D2A");
    EXPECT_EQ(RLECompression("aabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzz"), "2a2b2c2d2e2f2g2h2i2j2k2l2m2n2o2p2q2r2s2t2u2v2w2x2y2z");
    EXPECT_EQ(RLECompression("WWWWWWWWWWWWBWWWWWWWWWWWWBBBWWWWWWWWWWWWWWWWWWWWWWWWBWWWWWWWWWWWWWW"), "12W1B12W3B24W1B14W");
    EXPECT_EQ(RLECompression(",,,,    !!!! aaaa"), "4,4 4!1 4a");
    EXPECT_EQ(RLECompression("\t\t\t"), "3\t");
    EXPECT_EQ(RLECompression(""), "");
}

// Test the RLECompression on strings with digits
TEST(RLECompressSanityTests, WithDigitsStrings) {
    EXPECT_EQ(RLECompression("44444AABBBBBBBBBB6666666666"), "5\\42A10B10\\6");
    EXPECT_EQ(RLECompression("AAAA66666BBBCCD9999999999999999999999AA"), "4A5\\63B2C1D22\\92A");
    EXPECT_EQ(RLECompression("WW\\\\\\YYYY"), "2W3\\\\4Y");
    EXPECT_EQ(RLECompression("\\444AAAAAAA777777777zzzzzzzzzz"), "1\\\\3\\47A9\\710z");
    EXPECT_EQ(RLECompression("\\\\\\\\\\\\\\\\\\\\    22222!!!33"), "10\\\\4 5\\23!2\\3"); 
    EXPECT_EQ(RLECompression("234"), "1\\21\\31\\4");
    EXPECT_EQ(RLECompression("\\\\5"), "2\\\\1\\5");
    EXPECT_EQ(RLECompression("\\78"), "1\\\\1\\71\\8");
}


TEST(RLEDecompressSanityTest, TextWithoutNumericsCompression) {
    // Test the RLE-Decompression for basic text without numeric characters
    EXPECT_EQ(RLEDecompression("5B"), "BBBBB");
    EXPECT_EQ(RLEDecompression("4A3B2C1D2A"), "AAAABBBCCDAA");
    EXPECT_EQ(RLEDecompression("2W3X4Y"), "WWXXXYYYY");
    EXPECT_EQ(RLEDecompression("2a2b2c2d2e2f2g2h2i2j2k2l2m2n2o2p2q2r2s2t2u2v2w2x2y2z"), "aabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzz");
    EXPECT_EQ(RLEDecompression("12W1B12W3B24W1B14W"), "WWWWWWWWWWWWBWWWWWWWWWWWWBBBWWWWWWWWWWWWWWWWWWWWWWWWBWWWWWWWWWWWWWW");
    EXPECT_EQ(RLEDecompression("4,4 4!1 4a"), ",,,,    !!!! aaaa");
    EXPECT_EQ(RLEDecompression(""), "");
}

TEST(RLEDecompressSanityTest, TextWithNumericsCompression) {
    // Test the RLE-Decompression for text with numeric characters
    EXPECT_EQ(RLEDecompression("5\\42A10B10\\6"), "44444AABBBBBBBBBB6666666666");
    EXPECT_EQ(RLEDecompression("4A5\\63B2C1D22\\92A"), "AAAA66666BBBCCD9999999999999999999999AA");
    EXPECT_EQ(RLEDecompression("2W3\\\\4Y"), "WW\\\\\\YYYY");
    EXPECT_EQ(RLEDecompression("1\\\\3\\47A9\\710z"), "\\444AAAAAAA777777777zzzzzzzzzz");
    EXPECT_EQ(RLEDecompression("10\\\\4 5\\23!2\\3"), "\\\\\\\\\\\\\\\\\\\\    22222!!!33"); 
    EXPECT_EQ(RLEDecompression("1\\21\\31\\4"), "234");
    EXPECT_EQ(RLEDecompression("2\\\\1\\5"), "\\\\5");
    EXPECT_EQ(RLEDecompression("2\\\\3\t1Z"), "\\\\\t\t\tZ");
    EXPECT_EQ(RLEDecompression("1\\\\1\\71\\8"), "\\78");
}

TEST(RLEDecompressNegativeTest, TextWithoutNumericsCompression) {
    // Test invalid RLE-Decompression inputs for basic text without numeric characters
    EXPECT_THROW(RLEDecompression("0A"), std::invalid_argument);
    EXPECT_THROW(RLEDecompression("3A5!w"), std::invalid_argument);
    EXPECT_THROW(RLEDecompression("Q"), std::invalid_argument);
    EXPECT_THROW(RLEDecompression("2A3"), std::invalid_argument);
    EXPECT_THROW(RLEDecompression("&A"), std::invalid_argument);
}

TEST(RLEDecompressNegativeTest, TextWithNumericsCompression) {
    // Test invalid RLE-Decompression inputs for text with numeric characters
    EXPECT_THROW(RLEDecompression("0\\5A"), std::invalid_argument);
    EXPECT_THROW(RLEDecompression("3A\\3"), std::invalid_argument);
    EXPECT_THROW(RLEDecompression("Q33"), std::invalid_argument);
    EXPECT_THROW(RLEDecompression("2A43"), std::invalid_argument);
    EXPECT_THROW(RLEDecompression("4\\&A\\4"), std::invalid_argument);
    EXPECT_THROW(RLEDecompression("4\\A"), std::invalid_argument);
    EXPECT_THROW(RLEDecompression("1B5\\y5\\7"), std::invalid_argument);
}

// Init and run all tests
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}