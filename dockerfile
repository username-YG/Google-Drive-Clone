FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

COPY . /usr/googledrive/tests
WORKDIR /usr/googledrive/tests

RUN mkdir build
WORKDIR /usr/googledrive/tests/build

RUN cmake .. && make

CMD ["./tests"]
