#include <gtest/gtest.h>
#include "../src/compressions/RLE.h"

// Test the RLECompression on strings without digits
TEST(RLECompressSanityTests, NoDigitsStrings) {
    RLE rle;
    EXPECT_EQ(rle.compress("AAAAAAA"), "7A");
    EXPECT_EQ(rle.compress("AAAABBBCCDAA"), "4A3B2C1D2A");
    EXPECT_EQ(rle.compress("aabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzz"), "2a2b2c2d2e2f2g2h2i2j2k2l2m2n2o2p2q2r2s2t2u2v2w2x2y2z");
    EXPECT_EQ(rle.compress("WWWWWWWWWWWWBWWWWWWWWWWWWBBBWWWWWWWWWWWWWWWWWWWWWWWWBWWWWWWWWWWWWWW"), "12W1B12W3B24W1B14W");
    EXPECT_EQ(rle.compress(",,,,    !!!! aaaa"), "4,4 4!1 4a");
    EXPECT_EQ(rle.compress("\t\t\t"), "3\t");
    EXPECT_EQ(rle.compress(""), "");
}

// Test the RLECompression on strings with digits
TEST(RLECompressSanityTests, WithDigitsStrings) {
    RLE rle;
    EXPECT_EQ(rle.compress("44444AABBBBBBBBBB6666666666"), "5\\42A10B10\\6");
    EXPECT_EQ(rle.compress("AAAA66666BBBCCD9999999999999999999999AA"), "4A5\\63B2C1D22\\92A");
    EXPECT_EQ(rle.compress("WW\\\\\\YYYY"), "2W3\\\\4Y");
    EXPECT_EQ(rle.compress("\\444AAAAAAA777777777zzzzzzzzzz"), "1\\\\3\\47A9\\710z");
    EXPECT_EQ(rle.compress("\\\\\\\\\\\\\\\\\\\\    22222!!!33"), "10\\\\4 5\\23!2\\3"); 
    EXPECT_EQ(rle.compress("234"), "1\\21\\31\\4");
    EXPECT_EQ(rle.compress("\\\\5"), "2\\\\1\\5");
    EXPECT_EQ(rle.compress("\\78"), "1\\\\1\\71\\8");
}


TEST(RLEDecompressSanityTest, TextWithoutNumericsCompression) {
    RLE rle;
    // Test the RLE-Decompression for basic text without numeric characters
    EXPECT_EQ(rle.decompress("5B"), "BBBBB");
    EXPECT_EQ(rle.decompress("4A3B2C1D2A"), "AAAABBBCCDAA");
    EXPECT_EQ(rle.decompress("2W3X4Y"), "WWXXXYYYY");
    EXPECT_EQ(rle.decompress("2a2b2c2d2e2f2g2h2i2j2k2l2m2n2o2p2q2r2s2t2u2v2w2x2y2z"), "aabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzz");
    EXPECT_EQ(rle.decompress("12W1B12W3B24W1B14W"), "WWWWWWWWWWWWBWWWWWWWWWWWWBBBWWWWWWWWWWWWWWWWWWWWWWWWBWWWWWWWWWWWWWW");
    EXPECT_EQ(rle.decompress("4,4 4!1 4a"), ",,,,    !!!! aaaa");
    EXPECT_EQ(rle.decompress(""), "");
}

TEST(RLEDecompressSanityTest, TextWithNumericsCompression) {
    RLE rle;
    // Test the RLE-Decompression for text with numeric characters
    EXPECT_EQ(rle.decompress("5\\42A10B10\\6"), "44444AABBBBBBBBBB6666666666");
    EXPECT_EQ(rle.decompress("4A5\\63B2C1D22\\92A"), "AAAA66666BBBCCD9999999999999999999999AA");
    EXPECT_EQ(rle.decompress("2W3\\\\4Y"), "WW\\\\\\YYYY");
    EXPECT_EQ(rle.decompress("1\\\\3\\47A9\\710z"), "\\444AAAAAAA777777777zzzzzzzzzz");
    EXPECT_EQ(rle.decompress("10\\\\4 5\\23!2\\3"), "\\\\\\\\\\\\\\\\\\\\    22222!!!33"); 
    EXPECT_EQ(rle.decompress("1\\21\\31\\4"), "234");
    EXPECT_EQ(rle.decompress("2\\\\1\\5"), "\\\\5");
    EXPECT_EQ(rle.decompress("2\\\\3\t1Z"), "\\\\\t\t\tZ");
    EXPECT_EQ(rle.decompress("1\\\\1\\71\\8"), "\\78");
}

TEST(RLEDecompressNegativeTest, TextWithoutNumericsCompression) {
    RLE rle;
    // Test invalid RLE-Decompression inputs for basic text without numeric characters
    EXPECT_THROW(rle.decompress("0A"), invalid_argument);
    EXPECT_THROW(rle.decompress("3A5!w"), invalid_argument);
    EXPECT_THROW(rle.decompress("Q"), invalid_argument);
    EXPECT_THROW(rle.decompress("2A3"), invalid_argument);
    EXPECT_THROW(rle.decompress("&A"), invalid_argument);
}

TEST(RLEDecompressNegativeTest, TextWithNumericsCompression) {
    RLE rle;
    // Test invalid RLE-Decompression inputs for text with numeric characters
    EXPECT_THROW(rle.decompress("0\\5A"), invalid_argument);
    EXPECT_THROW(rle.decompress("3A\\3"), invalid_argument);
    EXPECT_THROW(rle.decompress("Q33"), invalid_argument);
    EXPECT_THROW(rle.decompress("2A43"), invalid_argument);
    EXPECT_THROW(rle.decompress("4\\&A\\4"), invalid_argument);
    EXPECT_THROW(rle.decompress("4\\A"), invalid_argument);
    EXPECT_THROW(rle.decompress("1B5\\y5\\7"), invalid_argument);
}