#include <gtest/gtest.h>
#include "../src/commands/searchCommand.h"
#include "../src/compressions/RLE.h"
#include <algorithm>
#include <cstdlib>
#include <fstream>
#include <filesystem>
#include <stdexcept>

// checks sanity of functionality of IsContain function
TEST(isContain, sanityTests) {
    searchCommand search(new RLE());
    EXPECT_EQ(search.IsContainsContent("Hello World", "World"), true);
    EXPECT_EQ(search.IsContainsContent("Hello World", "world"), false);
    EXPECT_EQ(search.IsContainsContent("The quick brown fox", "quick"), true);
    EXPECT_EQ(search.IsContainsContent("The quick brown fox", "slow"), false);
    EXPECT_EQ(search.IsContainsContent("", "content"), false);
    EXPECT_EQ(search.IsContainsContent("Some content here", ""), true);
}

// checks sanity of functionality of SearchFilesFromPath function
TEST(searchFilesFromPath, sanityTests) {

    const char* path_c_str = getenv("APP_PATH") ? getenv("APP_PATH") : "";
    filesystem::create_directories(path_c_str);

    // create tests files
    ofstream a(std::string(path_c_str) + "/a.txt");
    ofstream b(std::string(path_c_str) + "/b.txt");
    ofstream c(std::string(path_c_str) + "/c.txt");
    if (a) {
        a << "1s1t1r1i1n1g1\\1";
        a.close();
    }
    if (b) {
        b << "1s1t1r1i1n1g1\\2";
        b.close();
    }
    if (c) {
        c << "1s1t1r1i1n1g1\\3";
        c.close();
    }

    // checks the environment variable really loaded
    ASSERT_NE(path_c_str, nullptr) << "APP_PATH environment variable is not set in Docker!";

    searchCommand search(new RLE());
    std::vector<std::string> expected1 = {"a.txt", "b.txt", "c.txt"};
    std::vector<std::string> actual1 = search.SearchFilesFromPath(path_c_str, "string");
    std::vector<std::string> expected2 = {};
    std::vector<std::string> actual2 = search.SearchFilesFromPath(path_c_str, "hello world");
    std::vector<std::string> expected3 = {"a.txt"};
    std::vector<std::string> actual3 = search.SearchFilesFromPath(path_c_str, "string1");
    std::vector<std::string> expected4 = {"b.txt"};
    std::vector<std::string> actual4 = search.SearchFilesFromPath(path_c_str, "string2");
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

    std::filesystem::remove_all(path_c_str);
}

// checks edge cases of SearchFilesFromPath function
TEST(searchFilesFromPath, edgeCaseTests) {
    searchCommand search(new RLE());
    EXPECT_THROW(search.SearchFilesFromPath("testpath", "content"), std::runtime_error);
    EXPECT_THROW(search.SearchFilesFromPath("", "content"), std::runtime_error);
    EXPECT_THROW(search.SearchFilesFromPath("testpath", ""), std::runtime_error);
    filesystem::create_directories("testpath");
    ofstream a("testpath/a.txt");
    if (a) {
        a << "1c1o1n1t1e1n1t";
        a.close();
    }
    EXPECT_EQ(search.SearchFilesFromPath("testpath", "content"), std::vector<std::string>({"a.txt"}));
}