#include "ICommand.cpp"
#include "RLE.h"

#include <string>
#include <vector>

using namespace std;

class addCommand: public ICommand {
    public:
        string execute(const string& args) const override {return string();}
    private:
        void saveToFile(const string& pathStr, const string& content) {}
        friend class AddUnitTests_SaveToFileSanityTest_Test;
        friend class AddUnitTests_SaveToFileEdgeTest_Test;
};