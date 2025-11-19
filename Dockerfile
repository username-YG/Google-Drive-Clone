FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

COPY . /usr/src/menuTests
WORKDIR /usr/src/menuTests

RUN mkdir build
WORKDIR /usr/src/menuTests/build
RUN cmake .. && make

CMD ["./menuTests"]