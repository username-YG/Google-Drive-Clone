#include <gtest/gtest.h>
#include "../src/App.h"
#include "../src/menus/cliMenu.h"
#include "../src/commands/addCommand.h"
#include "../src/commands/getCommand.h"
#include "../src/commands/searchCommand.h"
#include "../src/compressions/RLE.h"

#include <map>
#include <string>
#include <vector>

TEST(AppCliRleTests, EndToEndTests) {
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
        App app(new CLIMenu(), commands);
        app.iteration();
        EXPECT_EQ(output.str(), value);

        // Rcover cin and cout
        cin.rdbuf(cinbuf);
        cout.rdbuf(coutbuf);
    }
}

// Init and run all tests
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}