#include <gtest/gtest.h>
#include "../src/search.h"
#include <vector>
#include <algorithm>


TEST(isContain, sanityTests) {
    EXPECT_EQ(IsContainsContent("Hello World", "World"), true);
    EXPECT_EQ(IsContainsContent("Hello World", "world"), false);
    EXPECT_EQ(IsContainsContent("The quick brown fox", "quick"), true);
    EXPECT_EQ(IsContainsContent("The quick brown fox", "slow"), false);
    EXPECT_EQ(IsContainsContent("", "content"), false);
    EXPECT_EQ(IsContainsContent("Some content here", ""), true);
}

// Test the RLECompression on strings without digits
// בקובץ הטסטים שלך (searchFilesTests.cpp)
// ...
#include <cstdlib>

// קריאה לפונקציה SearchFilesFromPath
TEST(searchFilesFromPath, sanityTests) {

    // קריאת הנתיב מתוך משתנה הסביבה של Docker
    const char* path_c_str = std::getenv("SEARCH_PATH");

    // ודא שהנתיב נטען! (הטסט יכשל אם לא)
    ASSERT_NE(path_c_str, nullptr) << "SEARCH_PATH environment variable is not set in Docker!";

    std::vector<std::string> expected1 = {"a.txt", "b.txt", "c.txt"};
    std::vector<std::string> actual1 = SearchFilesFromPath(path_c_str, "");
    std::vector<std::string> expected2 = {};
    std::vector<std::string> actual2 = SearchFilesFromPath(path_c_str, "hello world");
    std::vector<std::string> expected3 = {"a.txt"};
    std::vector<std::string> actual3 = SearchFilesFromPath(path_c_str, "string1");
    std::vector<std::string> expected4 = {"b.txt"};
    std::vector<std::string> actual4 = SearchFilesFromPath(path_c_str, "string2");
    // 1. Sort both vectors alphabetically
    std::sort(expected1.begin(), expected1.end());
    std::sort(actual1.begin(), actual1.end());
    std::sort(expected2.begin(), expected2.end());
    std::sort(actual2.begin(), actual2.end());
    std::sort(expected3.begin(), expected3.end());
    std::sort(actual3.begin(), actual3.end());
    std::sort(expected4.begin(), expected4.end());
    std::sort(actual4.begin(), actual4.end());

    // 2. Compare the sorted vectors
    EXPECT_EQ(actual1, expected1);
    EXPECT_EQ(actual2, expected2);
    EXPECT_EQ(actual3, expected3);
    EXPECT_EQ(actual4, expected4);
}


// Init and run all tests
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}