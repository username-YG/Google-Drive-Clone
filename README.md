# RLE Compression CLI System
# Advanced System Programming - Exercise 1

## Project Overview
Our application implements a Command Line Interface (CLI) system in C++ designed to manage compressed files. 
The system uses the RLE compression and decompression format.

Currently, our application supports the following commands:

- add: This command receives 2 string arguments - 'filename' and 'text'.
       It creates a new file named by filename, containing the RLE-compressed version of the given text.
       The file is saved inside the directory that's given to the program via an environment variable; we call it the root directory.
       The command returns no output.
  
- get: This command receives 1 string argument - 'filename'.
       It returns the RLE-decompressed text from the file named by filename from the root directory (see above).
       The command prints to the screen the file's text that it returned.
       
- search: This command receives 1 string argument - 'file content'.
          It finds all the files from the root directory that contain the text given by the argument (file content).
          The command returns a list of all these files' names and prints the list to the screen.

## Notes
- Each command will be written in one line and finished with an enter.
- Each command can be executed unlimitedly and in any sequence desired by the user.
- File names cannot contain spaces and cannot be an empty string.
- Any other or non-standard command (e.g., a non-existent command or an incomplete command) must be ignored.
- The program must print nothing else (no instructions, no errors, etc.). The output must strictly match the required format.
- The program runs endlessly (there is no defined 'quit' sign to stop running).

## Running Instructions
1. Clone the project repository from the Git.
2. Open the Dockerfile Desktop
3. Run in your terminal the line: "docker-compose run --rm app" (without the "")
Now you are able to use the program as much as you'd like!
Note for the checker: you can run the tests using the command "docker-compose run --rm gtests"

## Code Examples:
<img width="1600" height="626" alt="image" src="https://github.com/user-attachments/assets/ce8db6cd-2ad6-4364-a562-6985c5771214" />
<img width="1600" height="569" alt="image" src="https://github.com/user-attachments/assets/88f3b9df-35c6-43ad-a086-5f9fa28f4db4" />
<img width="1600" height="631" alt="image" src="https://github.com/user-attachments/assets/3241f4fd-bd57-4fad-9be6-201f5898c1fe" />

Enjoy!



