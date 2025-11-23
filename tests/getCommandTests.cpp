#include <gtest/gtest.h>
#include "../src/commands/getCommand.h"
#include "../src/compressions/RLE.h"
#include <stdexcept>
#include <string>
#include <fstream>
#include <cstdio>
#include <filesystem>

using namespace std;

// Test the splitArgs function
TEST(FilenameValiditySanityTest, FilenameValidityCheck) {
    getCommand cmd(new RLE());

    // Valid filenames - no exceptions should be thrown
    EXPECT_NO_THROW(cmd.isValidFilename("valid_filename.txt"));
    EXPECT_NO_THROW(cmd.isValidFilename("anotherValidFile123.doc"));
    EXPECT_NO_THROW(cmd.isValidFilename("file_name-with-mixed.CHARs"));
}

TEST(FilenameValidityNegativeTest, FilenameValidityCheck) {
    getCommand cmd(new RLE());

    // Invalid filenames - exceptions should be thrown
    EXPECT_THROW(cmd.isValidFilename("invalid filename.txt"), std::invalid_argument);
    EXPECT_THROW(cmd.isValidFilename("invalid  filename.doc"), std::invalid_argument);
    EXPECT_THROW(cmd.isValidFilename("invalid "), std::invalid_argument);
    EXPECT_THROW(cmd.isValidFilename(""), std::invalid_argument);
}

TEST(GettingFileContentSanityTest, GettingFileContent) {
    getCommand cmd(new RLE());

    // Creating and openning temporary file1 for the getFileContent method testing
    string filename1 = "testfile1.txt";
    string filename2 = "testfile2.txt";
    string filename3 = "testfile3.txt";

    ofstream file1(filename1);
    ofstream file2(filename2);
    ofstream file3(filename3);

    // Checking if the files were created successfully, if not - throwing an exception
    if (!file1) {
        throw runtime_error("Could not create test file: " + filename1);
    }
    if (!file2) {
        throw runtime_error("Could not create test file: " + filename2);
    }
    if (!file3) {
        throw runtime_error("Could not create test file: " + filename3);
    }

    // Writing some contents to the files
    file1 << "This is a test file.\nIt has multiple lines.\nEnd of file.";
    file1.close();

    file2 << "dfsdf sfsdfs dhshw hello there!\n \t wrting more content.";
    file2.close();

    file3 << "";
    file3.close();
    
    // Testing getFileContent method
    EXPECT_EQ(cmd.getFileContent("testfile1.txt", "."), "This is a test file.\nIt has multiple lines.\nEnd of file.");
    EXPECT_EQ(cmd.getFileContent("testfile2.txt", "."), "dfsdf sfsdfs dhshw hello there!\n \t wrting more content.");
    EXPECT_EQ(cmd.getFileContent("testfile3.txt", "."), "");

    // Deleting the temporary file after having finished the tests
    int result = remove(filename1.c_str());
    // Checking if the file was deleted successfully, if not - throwing an exception
    if (result != 0) {
        throw runtime_error("Could not delete test file: " + filename1);
    }
    result = remove(filename2.c_str());
    // Checking if the file was deleted successfully, if not - throwing an exception
    if (result != 0) {
        throw runtime_error("Could not delete test file: " + filename2);
    }
    result = remove(filename3.c_str());
    // Checking if the file was deleted successfully, if not - throwing an exception
    if (result != 0) {
        throw runtime_error("Could not delete test file: " + filename3);
    }
}

TEST(GettingFileContentNegativeTest, GettingFileContent) {
    getCommand cmd(new RLE());

    // Testing getFileContent method with non-existing files
    EXPECT_THROW(cmd.getFileContent("non_existing_file.txt", "."), runtime_error);
    EXPECT_THROW(cmd.getFileContent("another_missing_file.doc", "/helloworld"), runtime_error);
}

TEST(GetCommandIntegrationTest, ExecuteMethod) {
    getCommand cmd(new RLE());

    // Getting the path from the environment variable
    string path = getenv("APP_PATH") ? getenv("APP_PATH") : "";
    filesystem::create_directories(path);

    // Creating and openning temporary file for the execute method testing
    string filename1 = "testfile_execute_1.txt";
    string filename2 = "testfile_execute_2.txt";
    string filename3 = "testfile_execute_3.txt";

    ofstream file1(path + "/" + filename1);
    ofstream file2(path + "/" + filename2);
    ofstream file3(path + "/" + filename3);

    // Checking if the files were created successfully, if not - throwing an exception
    if (!file1) {
        throw runtime_error("Could not create test file: " + filename1);
    }
    if (!file2) {
        throw runtime_error("Could not create test file: " + filename2);
    }
    if (!file3) {
        throw runtime_error("Could not create test file: " + filename3);
    }

    // Writing RLE compressed content to the file
    file1 << "4A3B2C1D2A"; // Represents "AAAABBBCCDAA"
    file1.close();

    file2 << "10\\55Y1a"; // Represents "5555555555YYYYYa"
    file2.close();

    file3 << "1\\\\2A5\\34Z"; // Represents "\AA33333ZZZZ"
    file3.close();

    // Testing execute method
    EXPECT_EQ(cmd.execute("testfile_execute_1.txt"), "AAAABBBCCDAA\n");
    EXPECT_EQ(cmd.execute("testfile_execute_2.txt"), "5555555555YYYYYa\n");
    EXPECT_EQ(cmd.execute("testfile_execute_3.txt"), "\\AA33333ZZZZ\n");

    // Deleting the temporary files after having finished the tests
    // Checking if the files were deleted successfully, if not - throwing an exception
    if (!filesystem::remove_all(path)) {
        throw runtime_error("Could not delete test files in: " + path);
    }
}