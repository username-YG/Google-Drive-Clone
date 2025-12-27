#include <gtest/gtest.h>
#include "../src/commands/addCommand.h"
#include "../src/compressions/RLE.h"
#include <fstream>
#include <filesystem>
#include <map>

// Sanity tests for the function that saves text to file
TEST(AddUnitTests, SaveToFileSanityTest) {
    vector<string> texts = {
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore  laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679",
        "Hello.\nWorld.\nHow\tAre\tYou?\n",
        ""
    };
    RLE rle;
    addCommand add(&rle);
    for (const auto& text : texts) {
        add.saveToFile("testpath/testfile", text);
        ifstream file("testpath/testfile");
        ASSERT_TRUE(file.is_open());
        // Read the file and compare it's content with text
        EXPECT_EQ(string(istreambuf_iterator<char>(file) , {}), text);
        file.close();
        filesystem::remove_all("testpath");
    }
}

// Saving an existing file invalid
TEST(AddUnitTests, SaveToFileEdgeTest) {
    RLE rle;
    addCommand add(&rle);
    add.saveToFile("testpath/testfile", "Hello world");
    EXPECT_THROW(add.saveToFile("testpath/testfile", "Hello world"), invalid_argument);
    filesystem::remove_all("testpath");
}

// Ensure correct parsing of command arguments
TEST(AddUnitTests, ParseingTest) {
    RLE rle;
    addCommand add(&rle);
    EXPECT_EQ(add.parseArgs("filename.txt hello world"), vector<string>({"filename.txt", "hello world"}));
    EXPECT_EQ(add.parseArgs("filename.txt  "), vector<string>({"filename.txt", " "}));
    EXPECT_EQ(add.parseArgs("filename.txt "), vector<string>({"filename.txt", ""}));
    EXPECT_THROW(add.parseArgs("filename.txt"), invalid_argument);
    EXPECT_THROW(add.parseArgs(""), invalid_argument);
}

// Ensure correct parsing of command arguments
TEST(AddIntegrationTest, SanityTests) {
    map<string, string> IOMap = {
        {"testfile AAAAAAA", "7A"},
        {"testfile WWWWWWWWWWWWBWWWWWWWWWWWWBBBWWWWWWWWWWWWWWWWWWWWWWWWBWWWWWWWWWWWWWW", "12W1B12W3B24W1B14W"},
        {"testfile 44444AABBBBBBBBBB6666666666", "5\\42A10B10\\6"},
        {"testfile \\\\\\\\\\\\\\\\\\\\    22222!!!33", "10\\\\4 5\\23!2\\3"},
        {"testfile ", ""}
    };
    RLE rle;
    addCommand add(&rle);
    string path = getenv("APP_PATH") ? getenv("APP_PATH") : "";
    for (auto const& [key, value] : IOMap) {
        EXPECT_EQ(add.execute(key), "");
        ifstream file(path + "/testfile");
        ASSERT_TRUE(file.is_open());
        // Read the file and compare it's content with value
        EXPECT_EQ(string((istreambuf_iterator<char>(file)) , {}), value);
        file.close();
        filesystem::remove_all(path);
    }
}