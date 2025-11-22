FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

COPY . /usr/src/searchCommandTests
WORKDIR /usr/src/searchCommandTests

COPY tests/Files /tests/Files

ENV SEARCH_PATH=/tests/Files

RUN mkdir build
WORKDIR /usr/src/searchCommandTests/build
RUN cmake .. && make

CMD ["./searchCommandTests"]