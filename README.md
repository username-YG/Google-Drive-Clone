# Google Drive System
# Advanced System Programming - Exercise 3

## Project Overview
This part of the project focuses on building a web server using the MVC (Model-View-Controller) architecture, designed to serve as the core of our Google Drive application. 
The system manages users, files, directories, permissions and searches through a RESTful API.
Important Note: all the previous functionalities of the project (the Google Drive engine and the Client-Server communication), in particular the previous CPP server implementation,  are explained and implemented in the branches of the previous exercises, named:
- ex1-main
- ex2-main
The implementation of the code for our current part of the project is located under the branch 'ex3-main'.
In this way, we've "locked" the code of ex2's server and prevented any overrides by our new code for this part.

The Web Server is separated into 4 parts: models, routes, controllers and the main app (later on will also include views for the visual screens) as in the MVC structure we saw in class.
The Web Server contacts the CPP-Server, i.e., opens a socket to it and communicates with the server as a client.
More specifically, some of the models' files communicate with the CPP-Server, which functions as the "back-end" files and directories storage, to handle several HTTP requests.
The rest of the HTTP requests that don't require access to the back-end files and directories storage are handled directly through the models of the web server.
The CPP-Server contains a Thread Pool, that is a fixed amount of threads that are allocated once, and whenever a new client arrives, the server attaches an available thread to handle the client and their requests.
The size of the Thread Pool, which actually represents the number of clients the server can take care of concurrently, is given to the server as an environment variable (as well as the number of clients that can wait in the queue for the server at a time), and can be defined in the Docker-Compose file, to prevent the code from being hard-coded.

Currently, our application supports the following HTTP requests:


## Notes


## Running Instructions
1. Clone the repository and checkout to ex2-main:
```
git clone https://github.com/username-YG/Google-Drive-Project-ASP
cd Google-Drive-Project-ASP
git checkout ex2-main
```
2. Open Docker Desktop.
3. Start the server using:
```
docker compose up server
```
4. In another terminal, run the cpp-client:
```
docker compose run --rm cpp-client
```
5. In another terminal, run the python client:
```
docker compose run --rm py-client
```
Note for the checker: you can run the tests using the command "docker-compose run --rm gtests"
You can modify the port the server listens to or the path the files are saved to by writing PORT=[new_port] or APP_PATH=[new_path] before the command, for example: 
PORT=8080 APP_PATH=/mypath docker compose up server
Now you are able to use the program as much as you'd like!

## Running Examples:
<img width="1600" height="580" alt="image" src="https://github.com/user-attachments/assets/6bbcba7f-011d-4152-b32f-d82d77d96e35" />

<img width="1600" height="657" alt="image" src="https://github.com/user-attachments/assets/3ba16d89-318c-4cb6-9108-8d6c319b5229" />

Enjoy!



