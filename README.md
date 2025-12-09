# Google Drive System
# Advanced System Programming - Exercise 2

## Project Overview
This project represents the evolution of our original RLE file compression and decompression application from a CLI model to a distributed multi-threaded TCP *Client-Server* architecture. The system is essentially divided: the Server, implemented in C++, hosts all application intelligence and business logic, managing RLE operations and data processing. The Server's ability to handle multiple users simultaneously is achieved by dedicating a separate thread for each connected client, ensuring high concurrency while requiring careful implementation of thread synchronisation mechanism to manage shared resources safely. The listening port for the Server is specified as a command-line argument upon startup.

The Client, developed in both C++ and Python 3, functions as a console interface. It receives the Server's IP address and port as arguments and immediately establishes a single, persistent TCP connection for its entire runtime. The Client operates synchronously: it reads one command from the user, transports it across the persistent connection to the Server by a socket, and then blocks, waiting to receive and display the Server's response before accepting the next command, like the following animation:
<img width="2440" height="988" alt="image" src="https://github.com/user-attachments/assets/d73b539c-7587-431f-a071-32c5ac1ab419" />

Currently, our application supports the following commands:

- **POST**: This command receives 2 string arguments - 'filename' and 'text'.
       It creates a new file named by filename, containing the RLE-compressed version of the given text.
       The file is saved in the directory specified by an environment variable; we call it the root directory.
       The command prints the message "201 created" if legal.
  
- **GET**: This command receives 1 string argument - 'filename'.
       It returns the RLE-decompressed text from the file named by filename from the root directory (see above).
       The command prints the message "200 Ok" if legal and then the file's text to the screen.
       
- **SEARCH**: This command receives 1 string argument - 'file content'.
          It finds all the files from the root directory that contain the text given by the argument (file content).
          The command returns a list of all these files' names and prints the message "200 Ok" if legal, and then the list to the screen.
  
- **DELETE**: This command receives 1 string argument - 'filename'.
          It finds the file from the root directory that is named by filename and deletes it from the directory.
          The command prints the message "204 No Content" if legal.

## Notes
- Each command will be written in one line and finished with an enter.
- Each command can be executed unlimitedly and in any sequence desired by the user.
- File names cannot contain spaces and cannot be an empty string.
- Any other or non-standard command (e.g., a non-existent command or an incomplete command) must be ignored.
- The program must print nothing else (no instructions, no errors, etc.). The output must strictly match the required format.
- The program runs endlessly (there is no defined 'quit' sign to stop running).
- In cases where the command structure is legal but not correct logically, it prints the message "404 Not Found".
- In any other case or when the command is not structurely legal, it prints the message "400 Bad Request".

## Closed for Modification but Open for Extension
1. Did the fact that the command names changed require you to touch code that is supposed to be "closed for modification, but open for extension"?
    Answer: No, in ex1 main function, we created a map with the names "add", "get", and "search", each of them is tied to an ICommand object (a interface we created for all of the commands     that contains the method of "execute"), and gave the map as an argument to the App that runs all of the program. 
    So now we could just replace those names with the new ones and tie them to the same ICommands as before.

2. Did the fact that new commands were added require you to touch code that is supposed to be "closed for modification, but open for extension"?
   Answer: No, As explained in the previous question, we just added a new element to the map tied to a new object of ICommand.

3. Did the fact that the command output changed require you to touch code that is supposed to be "closed for modification, but open for extension"?
Answer: No, because we still needed to return the previous output as before and just add to it a proper message, so we just wrapped it inside a wrapper that checks the output and prints the correct message according to the output result. We did needed to change the messages that were thrown from several errors but it's only a minimal textual changes.

4. Did the fact that the input/output comes from sockets instead of the console require you to touch code that is supposed to be "closed for modification, but open for extension"?
Answer: No, we just generalized an interface from ex1 that controlled the input and output from the CLI menu to control general input and output, and added a class of that interface that use the send and receive functions of Socket and used them to send output or receive input.

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



