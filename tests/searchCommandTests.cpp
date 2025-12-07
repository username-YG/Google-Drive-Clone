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
    ofstream a(string(path_c_str) + "/a.txt");
    ofstream b(string(path_c_str) + "/b.txt");
    ofstream c(string(path_c_str) + "/c.txt");
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
    vector<string> expected1 = {"a.txt", "b.txt", "c.txt"};
    vector<string> actual1 = search.SearchFilesFromPath(path_c_str, "string");
    vector<string> expected2 = {};
    vector<string> actual2 = search.SearchFilesFromPath(path_c_str, "hello world");
    vector<string> expected3 = {"a.txt"};
    vector<string> actual3 = search.SearchFilesFromPath(path_c_str, "string1");
    vector<string> expected4 = {"b.txt"};
    vector<string> actual4 = search.SearchFilesFromPath(path_c_str, "string2");

    vector<string> expected5 = {"a.txt", "b.txt", "c.txt"};
    vector<string> actual5 = search.SearchFilesFromPath(path_c_str, "txt");
    vector<string> expected6 = {"a.txt", "b.txt", "c.txt"};
    vector<string> actual6 = search.SearchFilesFromPath(path_c_str, ".t");
    vector<string> expected7 = {"a.txt"};
    vector<string> actual7 = search.SearchFilesFromPath(path_c_str, "a");
    vector<string> expected8 = {"b.txt"};
    vector<string> actual8 = search.SearchFilesFromPath(path_c_str, "b.txt");

    // 1. Sort both vectors alphabetically
    sort(expected1.begin(), expected1.end());
    sort(actual1.begin(), actual1.end());
    sort(expected2.begin(), expected2.end());
    sort(actual2.begin(), actual2.end());
    sort(expected3.begin(), expected3.end());
    sort(actual3.begin(), actual3.end());
    sort(expected4.begin(), expected4.end());
    sort(actual4.begin(), actual4.end());

    sort(expected5.begin(), expected5.end());
    sort(actual5.begin(), actual5.end());
    sort(expected6.begin(), expected6.end());
    sort(actual6.begin(), actual6.end());
    sort(expected7.begin(), expected7.end());
    sort(actual7.begin(), actual7.end());
    sort(expected8.begin(), expected8.end());
    sort(actual8.begin(), actual8.end());

    // 2. Compare the sorted vectors
    EXPECT_EQ(actual1, expected1);
    EXPECT_EQ(actual2, expected2);
    EXPECT_EQ(actual3, expected3);
    EXPECT_EQ(actual4, expected4);

    EXPECT_EQ(actual5, expected5);
    EXPECT_EQ(actual6, expected6);
    EXPECT_EQ(actual7, expected7);
    EXPECT_EQ(actual8, expected8);

    filesystem::remove_all(path_c_str);
}

// checks edge cases of SearchFilesFromPath function
TEST(searchFilesFromPath, edgeCaseTests) {
    searchCommand search(new RLE());
    EXPECT_THROW(search.SearchFilesFromPath("testpath", "content"), runtime_error);
    EXPECT_THROW(search.SearchFilesFromPath("", "content"), runtime_error);
    EXPECT_THROW(search.SearchFilesFromPath("testpath", ""), runtime_error);
    filesystem::create_directories("testpath");
    ofstream a("testpath/a.txt");
    if (a) {
        a << "1c1o1n1t1e1n1t";
        a.close();
    }
    EXPECT_EQ(search.SearchFilesFromPath("testpath", "content"), vector<string>({"a.txt"}));
}