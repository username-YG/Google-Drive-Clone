#include "App.h"
#include <vector>

#include <iostream>

App::App(IMenu* menu, std::map<std::string, ICommand*> commands) : menu(menu), commands(commands) {}

void App::iteration() {
    std::vector<std::string> command = menu->nextCommand();
    try {
        // Ensure this is a real command
        if (commands.find(command[0]) != commands.end()) {
            std::string output = commands[command[0]]->execute(command[1]);
            menu->displayOutput(output);
        }
    } catch (...) {}
}

void App::run() {
    // The app runs forever
    while (true) {
        iteration();
    }
}