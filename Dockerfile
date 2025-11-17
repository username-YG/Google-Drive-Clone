FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

COPY . /usr/src/getSanityTests

WORKDIR /usr/src/getSanityTests

RUN mkdir build
WORKDIR /usr/src/getSanityTests/build

RUN cmake .. && make

# Run tests
CMD ["./getSanityTests"]