#include <string>
using namespace std;

// Search for files containing the given content
std::vector<string> SearchFilesFromPath(const string& root_path, const string& content);
// Check if a string contains the given content
bool IsContainsContent(const string& fileContent, const string& content);