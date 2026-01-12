# Google Drive System
# Advanced System Programming - Exercise 4

## Project Overview - Google Drive Application:
This project is a smart web application designed to emulate the core functionality and user experience of Google Drive. It is built as a modern Single Page Application that seamlessly integrates an interactive user interface with a dynamic backend server for real-time data management.

### System Architecture:
The application is composed of two primary layers:
- Frontend (React):
Component-Based Design: The interface is built using React, where every element (Sidebar, File Grid, Preview Overlay) is an independent component managing its own state.
Client-Side Routing: We utilized React Router to ensure the app loads once, allowing smooth transitions between Login, Registration, and the Main Dashboard without page refreshes.
Dynamic Theming: Advanced CSS implementation supports a full Light/Dark Mode toggle using CSS variables for high contrast and readability and an apealing display similar to the one in Google Drive.

- Backend (Node.js/Express and CPP server):
RESTful API: A web-server-side logic layer that manages all business operations.
Secure Authentication: User identity is verified via JWT (JSON Web Tokens) format, ensuring that only authorized users can access their private data.
Dynamic Fetching: All displayed contents (filenames, types, creation dates) are fetched asynchronously from the server; no data is hard-coded.
MVC arcitecture and connection to the CPP-server: An MVC arcitecture to support certain client requests in the web that require fetches from the CPP server which server as an item (file and folder)
storage facility.
HTTP requests format: All the communcation is handled with an HTTP requests as well as responses and status codes.

### How It Works (User Flow)

Security & Access: Users can register (sign up) with validated credentials whose validation is enforced both on the front-end (client-side) and on the back-end (server side), and log in, in case of an already existant user to receive a secure Token and go to the personal main page.
Additionaly, after havig gone to the main page of the app, users can log/sign out and go back to the registration screen.
Content Loading: Upon entering the main screen, the app requests the specific list of files and folders belonging to that authenticated user from the back-end server.
State Management: Using React Hooks like useState and useRef, the UI updates instantly when a user creates, renames, or deletes an item without needing to reload the entire site.
The system provides a convenient and handy set of file management tools.
Hierarchical Management: Users can create new folders and organize files as well as new folders within them to maintain a structured and nested workspace should they want to.

### Integrated File Viewer (Preview):
Double-clicking an item opens a professional Preview Overlay.
- Text Files: View and edit raw text directly within the app with dynamic zoom capabilities.
- Images: High-quality image rendering with dynamic zoom capabilities.
- PDFs: Built-in support for viewing PDF documents.

- Metadata Editing: Users can rename files and folders through intuitive and accessible editing tools and update text content directly in the viewer.
- Search & Filtering: A dynamic search bar allows users to locate specific files or folders by name and content in real-time and shows the fisrt several files that contain either in their content or name the string searched so far.
- Advanced UI Interactions:
- Selection: Visual feedback for selected items to perform quick actions.
- Action Menus: Context-sensitive menus for file operations (Edit, Delete, Rename).
- Theme Customization: A dedicated button to switch between Light and Dark themes, adjusting all UI elements from the sidebar to the file grid icons.
- User Profile Integration: The top bar displays the authenticated user’s display name and profile picture fetched from the server.

#### Important Notes:
 - When the user types at first the url of the main page while he isn't yet signed in, they will automitically be turned to the log-in page to first onl sign in and then access the main page, as it is in Google Drive.
 - From the logging in page there is a button to go to the registration (signing up) screen to register as a new user.
 - In the home page category of the main screen of the app all the files as well as folders are displays non-nestedly, as it is in Google Drive.

## Running Instructions
1. Clone the repository and checkout to ex4-main:
```
git clone https://github.com/username-YG/Google-Drive-Project-ASP
cd Google-Drive-Project-ASP
git checkout ex4-main
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
5. In another terminal, run the react server:
```
docker compose up --build react-app
```
6. Open a new web tab and connent to the main page:
```
http://localhost:5173/
```
7. You will then be directed to the home page if you are already signed in and otherwise directed to the log in page in which you will have to log in into an existing user or create a new one and then log in with the new account.
8. After having signed in you will reach the home page of the app.

Note for the checker #1: you can modify some of the variables in each run, those that are defined as environment variables in the docker compose file, by writing before the command:
- APP_PORT=[new_port] - The port the CPP server listens to 
- APP_PATH=[new_path] - The path the files are saved to
- WEB_PORT=[new_port] - The port the Web server listens to
- REACT_PORT=[new_port] - The port the React server listens to
- MAX_CLIENTS=[new_max] - The maximal number of clients that can wait in the queue to the server concurrently
- MAX_CLIENTS_AT_ONCE=[new_max] - The maximal number of clients the server can deal with concurrently

For example: 
- PORT=8080 APP_PATH=/mypath docker compose up server
- REACT_PORT=4000 docker compose up --build react-app

Note for the checker #2: you can run all the servers with one line using the command:
```
docker compose up --build react-app server web-server
``` 
