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
    // The command name is 
    vector<pair<string, string>> IOMap = {
        {"POST testfile1 XXXXXXX", ""},
        {"get testfile1", "XXXXXXX\n"},
        {"GET blah", ""},
        {"pOst testfile2 44444XXYYYYYYYYYY6666666666 ,,,,,,, hello %^&*((*&^%$#))", ""},
        {"GeT testfile2", "44444XXYYYYYYYYYY6666666666 ,,,,,,, hello %^&*((*&^%$#))\n"},
        {"search Y", "testfile2\n"},
        {"SEARCh Z", ""}
    };

    RLE comp;
    addCommand add(&comp);
    getCommand get(&comp);
    searchCommand search(&comp);
    map<string, ICommand*> commands = {
        {"POST", &add},
        {"GET", &get},
        {"SEARCH", &search},
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
        StreamInputOutput* streamIO = new StreamInputOutput();
        App app(streamIO, commands);
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