#include <gtest/gtest.h>
#include "../src/addCommand.cpp"

#include <fstream>
#include <map>
#include <filesystem>

// Sanity tests for the function that saves text to file
TEST(AddUnitTests, SaveToFileSanityTest) {
    vector<string> texts = {
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore  laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679",
        "Hello.\nWorld.\nHow\tAre\tYou?\n",
        ""
    };
    addCommand add;
    for (const auto& text : texts) {
        add.saveToFile("testpath/testfile", text);
        ifstream file("testpath/testfile");
        // Make sure the file exists
        ASSERT_TRUE(file.is_open());
        // Read the file and compare the content with text
        stringstream buffer;
        buffer << file.rdbuf();
        EXPECT_EQ(buffer.str(), text);
        // Close and remove the dir
        file.close();
        filesystem::remove_all("testpath");
    }
}

// Saving an existing file invalid
TEST(AddUnitTests, SaveToFileEdgeTest) {
    addCommand add;
    add.saveToFile("testpath/testfile", "Hello world");
    EXPECT_THROW(add.saveToFile("testpath/testfile", "Hello world"), std::invalid_argument);
    filesystem::remove_all("testpath");
}

// Init and run all tests
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}