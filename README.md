<img width="787" height="451" alt="image" src="https://github.com/user-attachments/assets/63dae989-2bca-404d-a28f-af039e0436c6" /># Google Drive System
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

Currently, our application supports the following:

### Authentication Header
HTTP requests that require authentication expect the following HTTP header to be present:

x-user-id: <authenticated user id>

If the header is missing, the server responds with **400 Bad Request**.

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
- 500 Internal Server Error: should there be any malfunctioning in the servers' end.

#### GET /api/files/:id

Returns metadata and content (the textual content for files and the files id's for directories) of the file or directory with the specified id.

Possible status codes:
- 200 OK: metadata and content returned.
- 400 Bad Request: missing authentication header.
- 404 Not Found: file or directory with the specified id does not exist.
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
- 404 Not Found: file or directory with the specified id does not exist or parent either does not exist or not a directory.
- 500 Internal Server Error: should there be any malfunctioning in the servers' end.

#### DELETE /api/files/:id

Deletes a file or directory (recursively for directories) with the specified id.

Possible status codes:
- 204 No Content: file or directory deleted successfully.
- 400 Bad Request: missing authentication header.
- 404 Not Found: file or directory with the specified id does not exist.
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
- 404 Not Found: file or directory with the specified id does not exist.
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
- 404 Not Found: file or directory with the specified id does not exist.
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
- 404 Not Found: file or directory with the specified id or permission (role) with the specified pId does not exist.
- 500 Internal Server Error: should there be any malfunctioning in the servers' end.

#### DELETE /api/files/:id/permissions/:pId

Deletes the permission (role) with the specified pId from the file or directory with the specified id permissions list.

Possible status codes:
- 204 No Content: permission deleted successfully.
- 400 Bad Request: missing authentication header.
- 403 Forbidden: insufficient permissions of the requester's (from the header) role.
- 404 Not Found: file or directory with the specified id or permission (role) with the specified pId does not exist.
- 500 Internal Server Error: should there be any malfunctioning in the servers' end.

### Search

#### GET /api/search/:query

Returns all files and directories whose name or content contains the query string.

Possible status codes:
- 200 OK: all files and directories matching returned.
- 400 Bad Request: missing authentication header.
- 500 Internal Server Error: should there be any malfunctioning in the servers' end.


## Notes
All error responses are returned as:
{
  "error": "Error description"
}
All requests and responses use JSON format.
Authentication is simplified (and mostly unchecked) for this exercise but will be extended in future steps of the project.

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
5. In the cmd, run the various HTTP requests listed above.

Note for the checker: you can run the tests using the command "docker-compose run --rm gtests"
You can modify the port the server listens to or the path the files are saved to by writing PORT=[new_port] or APP_PATH=[new_path] before the command, for example: 
PORT=8080 APP_PATH=/mypath docker compose up server
Now you are able to use the program as much as you'd like!

## Running Examples:


Enjoy!



