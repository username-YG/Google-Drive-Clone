#ifndef APP_H
#define APP_H

#include "IMenu.h"
#include "ICommand.h"
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