#include "StreamInputOutput.h"

StreamInputOutput::StreamInputOutput(istream& in, ostream& out) : in(in), out(out) {}

string StreamInputOutput::getInput() const {
    // Get the input from the stream
    string input;
    getline(in, input);
    return input;
}

void StreamInputOutput::returnOutput(const string& output) const {
    // Return the output to the stream
    out << output;
}