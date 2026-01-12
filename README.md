# Google Drive System
# Advanced System Programming - Exercise 4

## Project Overview - Google Drive Application:
This project is a smart web application designed to emulate the core functionality and user experience of Google Drive. It is built as a modern Single Page Application that seamlessly integrates an interactive user interface with a dynamic backend server for real-time data management.

### System Architecture:
The application is composed of two primary layers:
- Frontend (React):
Component-Based Design: The interface is built using React, where every element (Sidebar, File Grid, Preview Overlay) is an independent component managing its own state.
Client-Side Routing: We utilized React Router to ensure the app loads once, allowing smooth transitions between Login, Registration, and the Main Dashboard without page refreshes.
Dynamic Theming: Advanced CSS implementation supports a full Light/Dark Mode toggle using CSS variables for high contrast and readability.

- Backend (Node.js/Express):
RESTful API: A server-side logic layer that manages all business operations.
Secure Authentication: User identity is verified via JWT (JSON Web Tokens), ensuring that only authorized users can access their private data.
Dynamic Fetching: All displayed content (filenames, types, creation dates) is fetched asynchronously from the server; no data is hard-coded.

### How It Works (User Flow)

Security & Access: Users register with validated credentials and log in to receive a secure Token.
Content Loading: Upon entering the main screen, the app requests the specific list of files and folders belonging to that authenticated user from the server.
State Management: Using React Hooks like useState and useRef, the UI updates instantly when a user creates, renames, or deletes an item without needing to reload the entire site.
The system provides a comprehensive suite of file management tools.
Hierarchical Management: Users can create new folders and organize files within them to maintain a structured workspace.

### Integrated File Viewer (Preview):
Double-clicking an item opens a professional Preview Overlay.
- Text Files: View and edit raw text directly within the app with dynamic zoom capabilities.
- Images: High-quality image rendering with dynamic zoom capabilities.
- PDFs: Built-in support for viewing PDF documents.

- Metadata Editing: Users can rename files and folders through intuitive modals and update text content directly in the viewer.
- Search & Filtering: A dynamic search bar allows users to locate specific files or folders by name in real-time.
- Advanced UI Interactions:
- Selection: Visual feedback for selected items to perform quick actions.
- Action Menus: Context-sensitive menus for file operations (Edit, Delete, Rename).
- Theme Customization: A dedicated button to switch between Light and Dark themes, adjusting all UI elements from the sidebar to the file grid icons.
- User Profile Integration: The top bar displays the authenticated user’s display name and profile picture fetched from the server.

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



