#include "SocketInputOutput.h"
#include <sys/socket.h>
#include <unistd.h>
#include <stdexcept>

SocketInputOutput::SocketInputOutput(int sockIn, int sockOut): sockIn(sockIn), sockOut(sockOut) {}

SocketInputOutput::~SocketInputOutput() {
    close(sockIn);
    close(sockOut);
}

string SocketInputOutput::getInput() const {

    // Get message
    char buffer[BUF_SIZE];
    int read_bytes = recv(sockIn, buffer, BUF_SIZE, 0);
    if (read_bytes <= 0) throw runtime_error("Socket error");;
    string input = string(buffer, read_bytes);

    // Separate length and content
    size_t pos = input.find(' ');
    int length = stoi(input.substr(0, pos));
    input.erase(0, pos + 1);
    
    // Keep reading all bytes
    while (input.length() < length) {
        read_bytes = recv(sockIn, buffer, BUF_SIZE, 0);
        if (read_bytes <= 0) throw runtime_error("Socket error");;
        input += string(buffer, read_bytes);
    }

    return input;
}

void SocketInputOutput::returnOutput(const string& output) const {
    // Append the length of the message at the beginning
    string message = to_string(output.length()) + " " + output;
    int sent_bytes = send(sockOut, message.c_str(), message.size(), 0);
    if (sent_bytes < 0) return;
}