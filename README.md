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
Note that the main branch contains the current most updated version of our app (that is, for now, the version of this step - step 3).

The Web Server is separated into 4 parts: models, routes, controllers and the main app (later on will also include views for the visual screens) as in the MVC structure we saw in class.
The Web Server contacts the CPP-Server, i.e., opens a socket to it and communicates with the server as a client.
More specifically, some of the models' files communicate with the CPP-Server, which functions as the "back-end" files and directories storage, to handle several HTTP requests.
The rest of the HTTP requests that don't require access to the back-end files and directories storage are handled directly through the models of the web server.
The CPP-Server contains a Thread Pool, that is a fixed amount of threads that are allocated once, and whenever a new client arrives, the server attaches an available thread to handle the client and their requests.
The size of the Thread Pool, which actually represents the number of clients the server can take care of concurrently, is given to the server as an environment variable (as well as the number of clients that can wait in the queue for the server at a time), and can be defined in the Docker-Compose file, to prevent the code from being hard-coded.

Currently, our application supports the following:

### Authentication Header
HTTP requests that require authentication expect the following HTTP header to be present:

x-user-id: \<authenticated user id\>

If the header is missing, the server responds with **400 Bad Request**.  
If the specified user in the header doesn't exist, the server responds with **404 Not found**.  

### Users

#### POST /api/users

Creates a new user in the system. The request must include a JSON body containing a username, password, display name, and profile picture URL.
All fields are required; usernames and must be unique.

Request Body:
{
  "username": "string",
  "password": "string",
  "displayName": "string",
  "profilePic": "string"
}

The user will also have a generated ID that is unique per user assigned to them.

Possible status codes:
- 201 Created: user created successfully. Returns the location header: /api/users/{ID}
- 400 Bad Request: missing or invalid request body.
- 404 Not Found: username (unique) already exists.
- 500 Internal Server Error: should there be any malfunctioning in the servers' end.

#### GET /api/users/:id

Returns public information about a user with the specific id. The password is never returned.

Possible status codes:
- 200 OK: user information returned.
- 404 Not Found: user does not exist.
- 500 Internal Server Error: should there be any malfunctioning in the servers' end.

### Authentication Tokens

#### POST /api/tokens

Authenticates a user and checks that they are signed in using the username and password and returns an authentication token, which is the user's ID.

Request Body:
{
  "username": "string",
  "password": "string"
}

Possible status codes:
- 200 OK: returns the user's ID, that is the token:  { "token": "user-id" }
- 400 Bad Request: missing or incomplete body request.
- 404 Not Found: non-existant user's information.
- 500 Internal Server Error: should there be any malfunctioning in the servers' end.

### Files and Directories

Important Note: all HTTP requests below require authentication via the x-user-id header.

#### GET /api/files

Returns all files and directories located in the root directory (i.e. in '/').

Possible status codes:
- 200 OK: returns list of all the files and directories in root.
- 400 Bad Request: missing authentication header.
- 500 Internal Server Error: should there be any malfunctioning in the servers' end.

#### POST /api/files

Creates a new file or directory.

Request Body:
{
  "name": "string",
  "content": "string",
  "isFolder": true | false,
  "parentId": "string" | null (for root dir)
}

Possible status codes:
- 201 Created: file or directory created. Returns the location header: /api/files/{id}
- 400 Bad Request: missing header, body, or missing body fields.
- 404 Not Found: parent either does not exist or is not a directory.
- 403 Forbidden: the user isn't authorized to create in this folder.
- 500 Internal Server Error: should there be any malfunctioning in the servers' end.

#### GET /api/files/:id

Returns metadata and content (the textual content for files and the files id's for directories) of the file or directory with the specified id.

Possible status codes:
- 200 OK: metadata and content returned.
- 400 Bad Request: missing authentication header.
- 404 Not Found: file or directory with the specified id does not exist.
- 403 Forbidden: the user isn't authorized to view this item.
- 500 Internal Server Error: should there be any malfunctioning in the servers' end.

#### PATCH /api/files/:id

Updates an existing file or directory with the specified id.

Request Body:
{
  "name": "string",
  "content": "string",
  "parentId": "string" | null
}

Possible status codes:
- 204 No Content: file or directory updated successfully.
- 400 Bad Request: missing header/body or invalid fields.
- 404 Not Found: file or directory with the specified id does not exist or parent either does not exist or not a directory. Moving a folder into itself also causes this error.
- 403 Forbidden: the user isn't authorized to update this item or the new parent.
- 500 Internal Server Error: should there be any malfunctioning in the servers' end.

#### DELETE /api/files/:id

Deletes a file or directory (recursively for directories) with the specified id.

Possible status codes:
- 204 No Content: file or directory deleted successfully.
- 400 Bad Request: missing authentication header.
- 404 Not Found: file or directory with the specified id does not exist.
- 403 Forbidden: the user isn't authorized to delete this item.
- 500 Internal Server Error: should there be any malfunctioning in the servers' end.

### Permissions

Each file or directory maintains a permission list mapping users to roles.
Valid roles: owner, writer, commenter, reader.

Important Note: all HTTP requests below require authentication via the x-user-id header.

#### GET /api/files/:id/permissions

Returns all permissions associated with the file or directory with the specified id.

Possible status codes:
- 200 OK: permissions returned.
- 400 Bad Request: missing authentication header.
- 403 Forbidden: insufficient permissions of the requester's (from the header) role.
- 404 Not Found: file or directory with the specified id does not exist or the user in the header does not exist.
- 500 Internal Server Error: should there be any malfunctioning in the servers' end.

#### POST /api/files/:id/permissions

Creates a permission entry for a user for the file or directory with the specified id.

Request Body:
{
  "userID": "string",
  "role": "owner" | "writer" | "commenter" | "reader"
}

Possible status codes:
- 201 Created: permission created. Returns the location header: /api/files/{id}/permissions/{userID}
- 400 Bad Request: missing header or missing or incomplete body or invalid role (permission)
- 403 Forbidden: insufficient permissions of the requester's (from the header) role.
- 404 Not Found: file or directory with the specified id does not exist or the user in the header does not exist.
- 500 Internal Server Error: should there be any malfunctioning in the servers' end.

#### PATCH /api/files/:id/permissions/:pId

Updates the permission (role) with the specified pId for the file or directory with the specified id.

Request Body:
{
  "role": "owner" | "writer" | "commenter" | "reader"
}

Possible status codes:
- 204 No Content: permission updated successfully.
- 400 Bad Request: missing or incomplete header or body or invalid role (permission).
- 403 Forbidden: insufficient permissions of the requester's (from the header) role.
- 404 Not Found: file or directory with the specified id or permission (role) with the specified pId does not exist or the user in the header or the user with the specified pId does not exist.
- 500 Internal Server Error: should there be any malfunctioning in the servers' end.

#### DELETE /api/files/:id/permissions/:pId

Deletes the permission (role) with the specified pId from the file or directory with the specified id permissions list.

Possible status codes:
- 204 No Content: permission deleted successfully.
- 400 Bad Request: missing authentication header.
- 403 Forbidden: insufficient permissions of the requester's (from the header) role.
- 404 Not Found: file or directory with the specified id or permission (role) with the specified pId does not exist or the user in the header or the user with the specified pId does not exist.
- 500 Internal Server Error: should there be any malfunctioning in the servers' end.

### Search

#### GET /api/search/:query

Returns all files and directories whose name or content contains the query string.

Possible status codes:
- 200 OK: all files and directories matching returned.
- 400 Bad Request: missing authentication header.
- 404 Not Found: the user in the header does not exist.
- 500 Internal Server Error: should there be any malfunctioning in the servers' end.


## Notes
- The pId is the same as the userID, exactly like in Google Drive.
- If you want to create a new file under the root directory, insert "null" in the field asking for the parentID.
- All error responses are returned as:
  {
    "error": "Error description"
  }
- All requests and responses use JSON format.
- Authentication is simplified for this exercise but will be extended in future steps of the project.

## Running Instructions
1. Clone the repository and checkout to ex3-main:
```
git clone https://github.com/username-YG/Google-Drive-Project-ASP
cd Google-Drive-Project-ASP
git checkout ex3-main
```
2. Open Docker Desktop.
3. Start the cpp server using:
```
docker compose up --build server
```
4. In another terminal, run the web server:
```
docker compose up --build web-server
```
5. In the wsl, run the various HTTP requests listed above.

Note for the checker #1: you can run the tests using the command "docker-compose run --rm gtests".  
You can modify some of the variables in each run, those that are defined as environment variables in the docker compose file, by writing before the command:
- APP_PORT=[new_port] - The port the CPP server listens to 
- APP_PATH=[new_path] - The path the files are saved to
- WEB_PORT=[new_port] - The port the Web server listens to
- MAX_CLIENTS=[new_max] - The maximal number of clients that can wait in the queue to the server concurrently
- MAX_CLIENTS_AT_ONCE=[new_max] - The maximal number of clients the server can deal with concurrently

For example: 
PORT=8080 APP_PATH=/mypath docker compose up server

Note for the checker #2: In order to use "curl" commands in our server's REST API using BASH, you must follow a specific syntax to handle JSON data and headers correctly:

1. Command Flags:
- -i (Include): Displays the HTTP response headers (e.g., Status Code, Content-Type, Location).
- -X (Request Method): Specifies the HTTP method to use (GET, POST, PATCH, DELETE).
- -H (Header): Sets required headers like Content-Type or the mandatory x-user-id.
- -d (Data): Sends the data in the HTTP POST or PATCH request body.

2. Core Syntax Requirements
- Single Quotes for Data ('...'): Use single quotes to wrap the entire JSON body in the -d flag. This tells Bash to treat the content as a literal string, so you don't need to escape the double quotes inside.
- Standard Double Quotes: Inside the JSON, simply use standard double quotes " for keys and values (e.g., "name":"aaa").
- Authentication: Requests that require a logged-in user must include the x-user-id header.

Note for the checker #3: We decided to use the syntax of the HTTP requests (using curl) for wsl since it is easier to use and more compact. However, there is an equivalent syntax for the cmd where there are additional slashes needed for the parameters in the headers and body request. Moreoever, it is worth mentioning that in the wsl the printing/display format is to print the output without going one line before reprinting the shell's line for input. In cmd there is an enter. That is a matter of the shell in use and not related to our app. 
  
## For Example - Easy To Use HTTP Requests with Running Examples:

### Users
#### Create a new user
```bash
curl -i -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{"username": "tom@gmail.com", "password": "mypassword123", "displayName": "Tom Smith", "profilePic": "https://example.com/pic.jpg"}'
```

#### Get user by ID
```bash
curl -i -X GET http://localhost:3000/api/users/USER_ID_HERE
```
<img width="1798" height="592" alt="image" src="https://github.com/user-attachments/assets/f198fab8-910a-4375-8c95-3c5c9388e3cf" />

### Tokens (Authentication)

#### Sign in / Get token
```bash
curl -i -X POST http://localhost:3000/api/tokens -H "Content-Type: application/json" -d '{"username": "tom@gmail.com", "password": "mypassword123"}'
```
<img width="1801" height="304" alt="image" src="https://github.com/user-attachments/assets/ab4cc954-8026-428b-9afa-4927bb496a2b" />

### Files

#### Get all files
```bash
curl -i -X GET http://localhost:3000/api/files -H "x-user-id: USER_ID_HERE"
```

#### Create a new file
```bash
curl -i -X POST http://localhost:3000/api/files -H "Content-Type: application/json" -H "x-user-id: USER_ID_HERE" -d '{"name": "my-document.txt", "content": "Hello, this is the file content!", "isFolder": false, "parentId": null}'
```

#### Create a new folder
```bash
curl -i -X POST http://localhost:3000/api/files -H "Content-Type: application/json" -H "x-user-id: USER_ID_HERE" -d '{"name": "my-folder", "isFolder": true, "parentId": null}'
```
<img width="1804" height="519" alt="image" src="https://github.com/user-attachments/assets/74b6cd79-305f-458b-81f3-3ccb51b04457" />

#### Get a specific file
```bash
curl -i -X GET http://localhost:3000/api/files/FILE_ID_HERE -H "x-user-id: USER_ID_HERE"
```
<img width="1793" height="311" alt="image" src="https://github.com/user-attachments/assets/717e0466-7cda-4d74-8af2-260927c400a4" />

#### Update a file (rename)
```bash
curl -i -X PATCH http://localhost:3000/api/files/FILE_ID_HERE -H "Content-Type: application/json" -H "x-user-id: USER_ID_HERE" -d '{"name": "new-filename.txt"}'
```
#### Update a file (change content)
```bash
curl -i -X PATCH http://localhost:3000/api/files/FILE_ID_HERE -H "Content-Type: application/json" -H "x-user-id: USER_ID_HERE" -d '{"content": "Updated file content goes here"}'
```
<img width="1798" height="447" alt="image" src="https://github.com/user-attachments/assets/c1a8aff6-9c11-4b9e-a39e-85bbd7764278" />
<img width="1794" height="315" alt="image" src="https://github.com/user-attachments/assets/4f184b8e-9d63-4373-848b-95e8d40846d3" />

#### Update a file (move to different folder)
```bash
curl -i -X PATCH http://localhost:3000/api/files/FILE_ID_HERE -H "Content-Type: application/json" -H "x-user-id: USER_ID_HERE" -d '{"parentId": "NEW_PARENT_FOLDER_ID"}'
```
<img width="1801" height="538" alt="image" src="https://github.com/user-attachments/assets/0279b793-bf40-4051-a65d-a2237eb31e22" />

#### Delete a file
```bash
curl -i -X DELETE http://localhost:3000/api/files/FILE_ID_HERE -H "x-user-id: USER_ID_HERE"
```
<img width="1797" height="536" alt="image" src="https://github.com/user-attachments/assets/40b74b7d-5864-4db3-af0c-9401ecdfd2f5" />

### Permissions

#### Get permissions for a file/folder
```bash
curl -i -X GET http://localhost:3000/api/files/FILE_ID_HERE/permissions -H "x-user-id: USER_ID_HERE"
```
<img width="1802" height="782" alt="image" src="https://github.com/user-attachments/assets/330b7c4c-5751-47cd-8442-22b702b22d77" />

#### Create a permission (share with another user)
```bash
curl -i -X POST http://localhost:3000/api/files/FILE_ID_HERE/permissions -H "Content-Type: application/json" -H "x-user-id: OWNER_USER_ID" -d '{"userID": "TARGET_USER_ID", "role": "reader"}'
```
<img width="1798" height="567" alt="image" src="https://github.com/user-attachments/assets/b54350b3-0627-4069-a266-b4ca85bf349e" />

#### Update a permission
```bash
curl -i -X PATCH http://localhost:3000/api/files/FILE_ID_HERE/permissions/TARGET_USER_ID -H "Content-Type: application/json" -H "x-user-id: OWNER_USER_ID" -d '{"role": "writer"}'
```
<img width="1801" height="517" alt="image" src="https://github.com/user-attachments/assets/ee408ab8-6124-4acd-90a3-4360b39d0877" />


#### Delete a permission (revoke access)
```bash
curl -i -X DELETE http://localhost:3000/api/files/FILE_ID_HERE/permissions/TARGET_USER_ID -H "x-user-id: OWNER_USER_ID"
```
<img width="1805" height="483" alt="image" src="https://github.com/user-attachments/assets/0956fd8a-f9b4-41ef-875f-d3b57ceb6507" />

### Search

#### Search files and folders
```bash
curl -i -X GET "http://localhost:3000/api/search/SEARCH_QUERY_HERE" -H "x-user-id: USER_ID_HERE"
```
<img width="1906" height="264" alt="image" src="https://github.com/user-attachments/assets/d68b2006-cca3-424f-b1a9-e7c34d2d4a7d" />


You can now use the program as much as you'd like!
Enjoy!



