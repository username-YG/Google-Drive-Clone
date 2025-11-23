cmake_minimum_required(VERSION 3.10)

project(my_project CXX)

set(CMAKE_CXX_STANDARD 17)

include(FetchContent)
FetchContent_Declare(
        googletest
        URL https://github.com/google/googletest/archive/refs/tags/release-1.11.0.zip
)

set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

add_executable(getCommandUnitTests src/RLE.cpp src/getCommand.cpp tests/getCommandTests.cpp)

target_link_libraries(getCommandUnitTests gtest_main)
