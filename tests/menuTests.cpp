#include <gtest/gtest.h>
#include "../src/cliMenu.cpp"

TEST(GetSanityTest, BasicAssertions) {
    // Create an object of CLIMenu to access parse_input
    CLIMenu menu;

    // Test parsing
    EXPECT_EQ(menu.parse_input("get valid_file.txt"), vector<string>({"get", "valid_file.txt"}));
    EXPECT_EQ(menu.parse_input("geta"), vector<string>({"geta", ""}));
    EXPECT_EQ(menu.parse_input("get "), vector<string>({"get", ""}));
    EXPECT_EQ(menu.parse_input("upload file1.txt file2.txt"), vector<string>({"upload", "file1.txt file2.txt"}));
    EXPECT_EQ(menu.parse_input("delete   file3.txt"), vector<string>({"delete", "  file3.txt"}));
}

// Initiate and run the tests for the menu parsing
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
