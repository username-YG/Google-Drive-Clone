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
                ../src/storage-server/commands/addCommand.cpp
                ../src/storage-server/commands/getCommand.cpp
                ../src/storage-server/commands/searchCommand.cpp
                ../src/storage-server/commands/deleteCommand.cpp
                ../src/storage-server/compressions/RLE.cpp
                ../src/storage-server/InputOutputs/StreamInputOutput.cpp
                ../src/storage-server/InputOutputs/SocketInputOutput.cpp
                ../src/storage-server/App.cpp
                ../src/storage-server/clientHandlers/naiveClientHandler.cpp
                ../src/storage-server/clientHandlers/threadPoolClientHandler.cpp
                ../src/storage-server/servers/TCPServer.cpp
                ../src/storage-server/clients/TCPClient.cpp
                addCommandTests.cpp
                getCommandTests.cpp
                searchCommandTests.cpp
                deleteCommandTests.cpp
                RLETests.cpp
                InputOutputTests.cpp
                appTests.cpp
                clientServerTests.cpp
                )

target_link_libraries(tests gtest_main)