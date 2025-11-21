cmake_minimum_required(VERSION 3.10)

project(searchFilesTests)

# Use C++17 for std::filesystem
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find pthreads
find_package(Threads REQUIRED)

# GoogleTest
include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/refs/tags/release-1.11.0.zip
)

set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

# Add your sources and tests
add_executable(searchFilesTests
    src/get.cpp
    src/search.cpp
    tests/searchFilesTests.cpp
)

# Link GTest and pthread
target_link_libraries(searchFilesTests gtest_main Threads::Threads)
