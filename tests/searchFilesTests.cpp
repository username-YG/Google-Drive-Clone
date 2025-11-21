#include <gtest/gtest.h>
#include "../src/search.h"


TEST(isContain, sanityTests) {
    EXPECT_EQ(IsContainsContent("Hello World", "World"), true);
    EXPECT_EQ(IsContainsContent("Hello World", "world"), false);
    EXPECT_EQ(IsContainsContent("The quick brown fox", "quick"), true);
    EXPECT_EQ(IsContainsContent("The quick brown fox", "slow"), false);
    EXPECT_EQ(IsContainsContent("", "content"), false);
    EXPECT_EQ(IsContainsContent("Some content here", ""), true);
}

// Test the RLECompression on strings without digits
TEST(searchFiles, sanityTests) {
        std::vector<std::string> expected = {"a.txt", "b.txt", "c.txt"};
        EXPECT_EQ(SearchFiles("string"), expected);
}

// Init and run all tests
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
} 