#include <gtest/gtest.h>
#include "../src/App.h"
#include "../src/InputOutputs/StreamInputOutput.h"
#include "../src/commands/addCommand.h"
#include "../src/commands/getCommand.h"
#include "../src/commands/searchCommand.h"
#include "../src/compressions/RLE.h"

#include <map>
#include <string>
#include <vector>

TEST(AppClIRleTests, EndToEndTests) {
    map<string, string> IOMap = {
        {"add testfile1 AAAAAAA", ""},
        {"get testfile1", "AAAAAAA\n"},
        {"get blah", ""},
        {"add testfile2 44444AABBBBBBBBBB6666666666 ,,,,,,, hello %^&*((*&^%$#))", ""},
        {"get testfile2", "44444AABBBBBBBBBB6666666666 ,,,,,,, hello %^&*((*&^%$#))\n"},
        {"search B", "testfile2\n"},
        {"search C", ""}
    };

    map<string, ICommand*> commands = {
        {"add", new addCommand(new RLE())},
        {"get", new getCommand(new RLE())},
        {"search", new searchCommand(new RLE())}
    };

    // Backup cin and cout buffers
    auto cinbuf = cin.rdbuf();
    auto coutbuf = cout.rdbuf();

    for (auto const& [key, value] : IOMap) {
        // Redirect 'input' to cin and cout to 'output'
        stringstream input(key), output;
        cin.rdbuf(input.rdbuf());
        cout.rdbuf(output.rdbuf());

        // Run an iteration and check what was printed
        App app(new StreamInputOutput(), commands);
        app.iteration();
        EXPECT_EQ(output.str(), value);

        // Rcover cin and cout
        cin.rdbuf(cinbuf);
        cout.rdbuf(coutbuf);
    }
}

TEST(ParsingTests, AllTests) {
    // Test parsing
    EXPECT_EQ(App::parse_input("get valid_file.txt"), vector<string>({"get", "valid_file.txt"}));
    EXPECT_EQ(App::parse_input("geta"), vector<string>({"geta", ""}));
    EXPECT_EQ(App::parse_input("get "), vector<string>({"get", ""}));
    EXPECT_EQ(App::parse_input("upload file1.txt file2.txt"), vector<string>({"upload", "file1.txt file2.txt"}));
    EXPECT_EQ(App::parse_input("delete   file3.txt"), vector<string>({"delete", "  file3.txt"}));
}

// Init and run all tests
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}