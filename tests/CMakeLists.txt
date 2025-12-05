cmake_minimum_required(VERSION 3.10)

project(my_project)

set(CMAKE_CXX_STANDARD 17)

include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/refs/tags/release-1.11.0.zip
)

# For Windows: Prevent overriding the parent project's compiler/linker settings
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

add_executable(tests
                ../src/commands/addCommand.cpp
                ../src/commands/getCommand.cpp
                ../src/commands/searchCommand.cpp
                ../src/compressions/RLE.cpp
                ../src/InputOutputs/StreamInputOutput.cpp
                ../src/InputOutputs/SocketInputOutput.cpp
                ../src/App.cpp
                ../src/clientHandlers/naiveClientHandler.cpp
                ../src/servers/TCPServer.cpp
                ../src/clients/TCPClient.cpp
                addCommandTests.cpp
                getCommandTests.cpp
                searchCommandTests.cpp
                RLETests.cpp
                InputOutputTests.cpp
                appTests.cpp
                clientServerTests.cpp
                )

target_link_libraries(tests gtest_main)