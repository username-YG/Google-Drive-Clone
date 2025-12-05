#include <gtest/gtest.h>
#include "../src/commands/deleteCommand.h"
#include <stdexcept>
#include <string>
#include <fstream>
#include <filesystem>


TEST(isValidFileSanityTest, isValidFileCheck) {
    deleteCommand cmd;

    // Getting the path from the environment variable
    string path = getenv("APP_PATH") ? getenv("APP_PATH") : "";
    filesystem::create_directories(path);

    // Creating and openning temporary file for the deleteFile method testing
    string filename1 = "delete_testfile1.txt";
    string filename2 = "delete_testfile2.txt";
    string filename3 = "delete_testfile3.txt";

    ofstream file1(path + "/" + filename1);
    ofstream file2(path + "/" + filename2);
    ofstream file3(path + "/" + filename3);

    // Closing the files
    file1.close();
    file2.close();
    file3.close();

    // Valid filenames - no exceptions should be thrown
    EXPECT_NO_THROW(cmd.isValidFile("delete_testfile1.txt", path));
    EXPECT_NO_THROW(cmd.isValidFile("delete_testfile2.txt", path));
    EXPECT_NO_THROW(cmd.isValidFile("delete_testfile3.txt", path));
}

TEST(isValidFileNegativeTest, isValidFileCheck) {
    deleteCommand cmd;

    // Invalid filenames - exceptions should be thrown
    EXPECT_THROW(cmd.isValidFile("", ""), invalid_argument);
    EXPECT_THROW(cmd.isValidFile("invalid filename.txt", ""), invalid_argument);
    EXPECT_THROW(cmd.isValidFile("non_existing_file.doc", ""), runtime_error);
    EXPECT_THROW(cmd.isValidFile("missingFile.txt", ""), runtime_error);
}

TEST(deleteFileSanityTest, deleteFileCheck) {
    deleteCommand cmd;

    // Creating and openning temporary file for the deleteFile method testing
    string filename1 = "delete_testfile1.txt";
    string filename2 = "delete_testfile2.txt";
    string filename3 = "delete_testfile3.txt";

    // Getting the path from the environment variable
    string path = getenv("APP_PATH") ? getenv("APP_PATH") : "";
    filesystem::create_directories(path);

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

    // Writing some content to the files
    file1 << "Hello!";
    file2 << "Heyy!";
    file3 << "Blablabla";

    // Closing the files
    file1.close();
    file2.close();
    file3.close();

    // Deleting the files using deleteCommand
    cmd.deleteFile(filename1, path);
    cmd.deleteFile(filename2, path);
    cmd.deleteFile(filename3, path);

    // Checking if the files were deleted successfully
    EXPECT_FALSE(filesystem::exists(path + "/" + filename1));
    EXPECT_FALSE(filesystem::exists(path + "/" + filename2));
    EXPECT_FALSE(filesystem::exists(path + "/" + filename3));
}

TEST(deleteFileNegativeTest, deleteFileCheck) {
    deleteCommand cmd;

    // Trying to delete non-existing files - exceptions should be thrown
    EXPECT_THROW(cmd.deleteFile("non_existing_file1.txt", ""), runtime_error);
    EXPECT_THROW(cmd.deleteFile("non_existing_file2.doc", ""), runtime_error);
    EXPECT_THROW(cmd.deleteFile("", ""), invalid_argument);
    EXPECT_THROW(cmd.deleteFile("invalid filename.txt", ""), invalid_argument);
}

TEST(DeleteCommandSanityTest, executeMethodCheck) {
    deleteCommand cmd;

    // Getting the path from the environment variable
    string path = getenv("APP_PATH") ? getenv("APP_PATH") : "";
    filesystem::create_directories(path);

    // Creating and openning temporary file for the execute method testing
    string filename1 = "delete_testfile_execute_1.txt";
    string filename2 = "delete_testfile_execute_2.txt";
    string filename3 = "delete_testfile_execute_3.txt";

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

    // Writing some content to the files
    file1 << "Hello!";
    file2 << "Heyy!";
    file3 << "Blablabla";

    // Closing the files
    file1.close();
    file2.close();
    file3.close();

    // Deleting the files through using execute method
    cmd.execute(filename1);
    cmd.execute(filename2);
    cmd.execute(filename3);

    // Checking if the files were deleted successfully
    EXPECT_FALSE(filesystem::exists(path + "/" + filename1));
    EXPECT_FALSE(filesystem::exists(path + "/" + filename2));
    EXPECT_FALSE(filesystem::exists(path + "/" + filename3));
}

TEST(DeleteCommandNegativeTest, executeMethodCheck) {
    deleteCommand cmd;

    // Trying to delete non-existing files using execute method - exceptions should be thrown
    EXPECT_THROW(cmd.execute("non_existing_file1.txt"), runtime_error);
    EXPECT_THROW(cmd.execute("non_existing_file2.doc"), runtime_error);
    EXPECT_THROW(cmd.execute(""), invalid_argument);
    EXPECT_THROW(cmd.execute("invalid filename.txt"), invalid_argument);
}