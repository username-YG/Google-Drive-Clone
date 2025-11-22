FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

COPY . /usr/src/getCommandTests
WORKDIR /usr/src/getCommandTests

RUN mkdir build
WORKDIR /usr/src/getCommandTests/build
RUN cmake .. && make

CMD ["./getCommandUnitTests"]