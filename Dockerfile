FROM gcc:latest

# Install CMake
RUN apt-get update && apt-get install -y cmake

# Copy project files
COPY . /usr/src/searchFilesTests
WORKDIR /usr/src/searchFilesTests

# Copy the tests/Files folder into the container
# This is the folder your SearchFiles function should use
COPY tests/Files /tests/Files

# Set environment variable for SearchFiles
ENV SEARCH_PATH=/tests/Files

# Build the project
RUN mkdir build
WORKDIR /usr/src/searchFilesTests/build
RUN cmake .. && make

# Run tests by default
CMD ["./searchFilesTests"]
