FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

COPY . /usr/src/addCommandTests
WORKDIR /usr/src/addCommandTests

RUN mkdir build
WORKDIR /usr/src/addCommandTests/build
RUN cmake .. && make

CMD ["./addTests"]
