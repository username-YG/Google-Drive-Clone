#ifndef SEARCH_H
#define SEARCH_H

#include "ICommand.h"
#include "ICompression.h"
using namespace std;

class searchCommand: public ICommand {
    friend class isContain_sanityTests_Test;
    friend class searchFilesFromPath_sanityTests_Test;

    public:
        searchCommand(ICompression* comp);
        string execute(const string& args) const override;
    private:
        ICompression* comp;
        // Search for files containing the given content
        vector<string> SearchFilesFromPath(const string& root_path, const string& content) const;
        // Check if a string contains the given content
        bool IsContainsContent(const string& fileContent, const string& content) const;
};

#endif