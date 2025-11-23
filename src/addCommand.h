#ifndef ADD_H
#define ADD_H

#include "ICommand.h"
#include <string>
#include <vector>

using namespace std;

class addCommand: public ICommand {
    public:
        string execute(const string& args) const override;

    private:
        void saveToFile(const string& pathStr, const string& content) const;
        vector<string> parseArgs(const string& args) const;

        // Test classes are allowed to access private functions
        friend class AddUnitTests_SaveToFileSanityTest_Test;
        friend class AddUnitTests_SaveToFileEdgeTest_Test;
        friend class AddUnitTests_ParseingTest_Test;
};

#endif