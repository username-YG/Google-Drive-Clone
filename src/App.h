#ifndef APP_H
#define APP_H

#include "menus/IMenu.h"
#include "commands/ICommand.h"
#include <map>
#include <string>

class App {
    private:
        IMenu* menu;
        std::map<std::string, ICommand*> commands;

        void iteration();

    public:
        App(IMenu* menu, std::map<std::string, ICommand*> commands);
        void run();

        friend class AppCliRleTests_EndToEndTests_Test;
};

#endif