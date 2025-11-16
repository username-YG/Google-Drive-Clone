FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

COPY . /usr/src/getNegativeTests

WORKDIR /usr/src/getNegativeTests

RUN mkdir build
WORKDIR /usr/src/getNegativeTests/build

RUN cmake .. && make

# Run tests
CMD ["./getNegativeTests"]