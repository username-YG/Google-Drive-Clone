#include "App.h"
#include "commands/addCommand.h"
#include "commands/getCommand.h"
#include "commands/searchCommand.h"
#include "InputOutput/StreamInputOutput.h"
#include "compressions/ICompression.h"
#include "compressions/RLE.h"

#include <map>
#include <string>

// Run the app with RLE and CLI and add, get, search commands
int main(int argc, char **argv) {
    ICompression* comp = new RLE();
    StreamInputOutput *cli = new StreamInputOutput();
    map<string, ICommand*> commands = {
        {"add", new addCommand(comp)},
        {"get", new getCommand(comp)},
        {"search", new searchCommand(comp)}
    };

    App app(cli, commands);
    app.run();
}