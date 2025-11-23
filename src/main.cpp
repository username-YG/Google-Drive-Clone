#include "App.h"
#include "addCommand.h"
#include "getCommand.h"
#include "searchCommand.h"
#include "cliMenu.h"

#include <map>
#include <string>

int main() {
    IMenu *menu = new CLIMenu();
    map<string, ICommand*> commands = {
        {"add", new addCommand()},
        {"get", new getCommand()},
        {"search", new searchCommand()}
    };

    App app(menu, commands);
    app.run();
}