#include "App.h"
#include <vector>

App::App(IMenu* menu, std::map<std::string, ICommand*> commands) : menu(menu), commands(commands) {}

void App::iteration() {
    std::vector<std::string> command = menu->nextCommand();
    try {
        std::string output = commands[command[0]]->execute(command[1]);
        menu->displayOutput(output);
    } catch (...) {}
}

void App::run() {
    while (true) {
        iteration();
    }
}