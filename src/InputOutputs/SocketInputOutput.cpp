#include "SocketInputOutput.h"
#include <sys/socket.h>
#include <unistd.h>
#include <iostream>///////////////////////////////

SocketInputOutput::SocketInputOutput(int sockIn, int sockOut): sockIn(sockIn), sockOut(sockOut) {}

SocketInputOutput::~SocketInputOutput() {
    close(sockIn);
    close(sockOut);
}

string getHeader(const string& message) {
    size_t pos = message.find(' ');
    if (pos != string::npos) return message.substr(0, pos);
}

string getBody(const string& message) {
    size_t pos = message.find(' ');
    if (pos != string::npos) return message.substr(pos + 1);
}

string SocketInputOutput::getInput() const {
    string input;
    char buffer[BUF_SIZE];
    int read_bytes = recv(sockIn, buffer, BUF_SIZE, 0);
    if (read_bytes <= 0) return input;
    input = string(buffer, read_bytes);

    string header = getHeader(input);
    string body = getBody(input);
    int length = stoi(header) - body.length();

    while (length > 0) {
        int read_bytes = recv(sockIn, buffer, BUF_SIZE, 0);
        if (read_bytes <= 0) return input;
        input += string(buffer, read_bytes);
        length -= read_bytes;
    }

    return input;
}

void SocketInputOutput::returnOutput(const string& output) const {
    // Append the length of the message at the beginning
    string len = to_string(output.length());
    string message = len + " " + output;
    int sent_bytes = send(sockOut, message.c_str(), message.size(), 0);
    if (sent_bytes < 0) {
        return;
    }
}