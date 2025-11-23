#ifndef GET_H
#define GET_H

#include "ICommand.h"
#include "ICompression.h"
#include <string>

using namespace std;

class getCommand: public ICommand {
    friend class FilenameValiditySanityTest_FilenameValidityCheck_Test;
    friend class FilenameValidityNegativeTest_FilenameValidityCheck_Test;
    friend class GettingFileContentSanityTest_GettingFileContent_Test;
    friend class GettingFileContentNegativeTest_GettingFileContent_Test;

    private:
        ICompression* comp;
        void isValidFilename(const string& filename) const;
        string getFileContent(const string& filename, const string& path) const;

    public:
        getCommand(ICompression* comp);
        string execute(const string& args) const override;
};

#endif