#include <gtest/gtest.h>
#include "../src/App.h"
#include "../src/cliMenu.h"
#include "../src/addCommand.h"
#include "../src/getCommand.h"
#include "../src/searchCommand.h"

#include <map>
#include <string>
#include <vector>

using namespace std;

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
        {"add", new addCommand()},
        {"get", new getCommand()},
        {"search", new searchCommand()}
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

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}