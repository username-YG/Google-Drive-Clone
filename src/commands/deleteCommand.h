#ifndef DELETE_H
#define GET_H

#include "ICommand.h"
#include <string>

using namespace std;

class deleteCommand: public ICommand {
    // Friend classes for Test to be allowed to access private functions
    friend class isValidFileSanityTest_isValidFileCheck_Test;
    friend class isValidFileNegativeTest_isValidFileCheck_Test;
    friend class deleteFileSanityTest_deleteFileCheck_Test;
    friend class deleteFileNegativeTest_deleteFileCheck_Test;

    private:
        // Validating the filename and checking for its existence
        void isValidFile(const string& filename) const;
        // Deleting the specified file
        void deleteFile(const string& filename) const;

    public:
        deleteCommand();
        // Executing the delete command with the given arguments
        string execute(const string& args) const override;
};

#endif