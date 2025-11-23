#include "App.h"
#include "addCommand.h"
#include "getCommand.h"
#include "searchCommand.h"
#include "cliMenu.h"
#include "ICompression.h"
#include "RLE.h"

#include <map>
#include <string>

int main(int argc, char **argv) {
    ICompression* comp = new RLE();
    IMenu *menu = new CLIMenu();
    map<string, ICommand*> commands = {
        {"add", new addCommand(comp)},
        {"get", new getCommand(comp)},
        {"search", new searchCommand(comp)}
    };

    App app(menu, commands);
    app.run();
}