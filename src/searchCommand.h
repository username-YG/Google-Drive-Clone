#ifndef SEARCH_H
#define SEARCH_H

#include "ICommand.h"

using namespace std;

class searchCommand: public ICommand {
    public:
        string execute(const string& args) const override;
    private:
        // Search for files containing the given content
        vector<string> SearchFilesFromPath(const string& root_path, const string& content) const;
        // Check if a string contains the given content
        bool IsContainsContent(const string& fileContent, const string& content) const;
};

#endif