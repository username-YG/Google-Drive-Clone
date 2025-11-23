#include "App.h"
#include "commands/addCommand.h"
#include "commands/getCommand.h"
#include "commands/searchCommand.h"
#include "menus/cliMenu.h"
#include "../compressions/ICompression.h"
#include "compressions/RLE.h"

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