#include <gtest/gtest.h>
#include <StreamInputOutput.h>
#include <map>

// Testing the IO from stream functionality
TEST(IOTests, StreamTests) {
    vector<string> texts = {
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore  laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679",
        "Hello.\nWorld.\nHow\tAre\tYou?\n",
        ""
    };
    for (const auto& text : texts) {
        istringstream in(text);
        ostringstream out;
        StreamInputOutput streamIO(in, out);
        EXPECT_EQ(streamIO.getInput(), text);
        streamIO.returnOutput(text);
        EXPECT_EQ(out.str(), text);
    }
}