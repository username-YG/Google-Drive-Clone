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

## Running Examples:
First of all, entering the site requires you to log inL
<img width="1875" height="812" alt="image" src="https://github.com/user-attachments/assets/99a3d656-e190-4698-8928-72c66d120363" />

If you don't have an account yet, you can press "Create account" and you will be moved to this Registeration screen:
<img width="1855" height="810" alt="image" src="https://github.com/user-attachments/assets/d4826053-c3d5-46e2-8244-4ee436418ea2" />

After finishing Registration, you'll return to the Login screen and now sign in with the new account you created.
Now, after signing in, this is the Main App page:
<img width="1900" height="831" alt="image" src="https://github.com/user-attachments/assets/6d259a69-c5af-4d42-834a-0586d728424f" />

To upload new files/folders (or create folders) you can press the button "+ New" from the side bar and you'll see this:
<img width="492" height="325" alt="image" src="https://github.com/user-attachments/assets/b0d7eb2a-7734-43e6-a175-423faa7664de" />

For uploading files/folders, pressing on the button will open your local files browser and you can choose from it:
<img width="1049" height="707" alt="image" src="https://github.com/user-attachments/assets/b90ea47f-e101-4782-817a-8d54bbcbb6c6" />

After adding some files and create a folder for example, the screen looks like that:
<img width="1870" height="815" alt="image" src="https://github.com/user-attachments/assets/bc4d7ea1-2efa-4a2c-941a-f90c9148e927" />

You can press each of the files to open a preview of it:
<img width="1850" height="828" alt="image" src="https://github.com/user-attachments/assets/329af12a-4db4-469e-b3fa-0890b408b6ee" />
You can see the bar with all of the options mentioned above at the top, and the zoom bar at the bottom. 
For example, this is what pressing on the Edit text button looks like:
<img width="1690" height="832" alt="image" src="https://github.com/user-attachments/assets/9e1f63c5-91ce-427a-bd09-f81c0f2c0c0a" />
<img width="1813" height="823" alt="image" src="https://github.com/user-attachments/assets/511f0b02-b7ad-49e6-abdb-6dfc8dea65ae" />

To exit preview mode, you can press on the close button (X) on the left-top edge, or just press the dark background outside the file itself.

You can also click the 3 dots button on each file to open it's menu with similar options but without entering preview mode:
<img width="1554" height="695" alt="image" src="https://github.com/user-attachments/assets/e3e3ccf4-8210-4fe5-bde7-9866d42ff424" />

You also have at the side bar several pages with unique attributes:
Home: The home page of the app, you can see there all the files you have access to:
<img width="1554" height="695" alt="image" src="https://github.com/user-attachments/assets/71b97c9c-a3b2-4755-a0c8-3423338efd64" />

My drive: Presents only the files you are the owner of.
Shared with me: Presents all the files that another users gave you permissions of:
<img width="1885" height="799" alt="image" src="https://github.com/user-attachments/assets/fa7e273b-c1f2-4448-a2f9-6925c26a6854" />

Recent: Presents the files you opened recently.
Starred: pressing the "Add to starred" button for a file will allow you to see it on the Starred page:
<img width="1646" height="821" alt="image" src="https://github.com/user-attachments/assets/7ed1202a-ca83-4f4f-8802-454cd8909b9d" />

Trash: Presents all the files you sent to trash. only from there you delete files permanently:
<img width="1134" height="659" alt="image" src="https://github.com/user-attachments/assets/5cae807a-6fdf-4607-939d-fe5453f0271d" />
<img width="772" height="566" alt="image" src="https://github.com/user-attachments/assets/69c2d9c7-f846-4c1b-a96c-00404009bb1a" />
<img width="739" height="543" alt="image" src="https://github.com/user-attachments/assets/7cb0e3bf-cf72-4f44-9acb-ac5253b2d888" />
<img width="1828" height="677" alt="image" src="https://github.com/user-attachments/assets/41dd8543-7be4-4d52-a23d-54feae6b2a47" />

You think we're done? We have even more abilities!
Search bar: You can search files by their names (or even text files by their content):
<img width="1889" height="763" alt="image" src="https://github.com/user-attachments/assets/a2bdbd4c-437e-4b22-9110-f9cdc39cedb9" />

You can sign out and add other accounts:
<img width="622" height="485" alt="image" src="https://github.com/user-attachments/assets/96bf3503-9543-4770-8a7c-6ff3b6d7d626" />
<img width="472" height="241" alt="image" src="https://github.com/user-attachments/assets/2a78fad7-29fc-4207-b122-12a99461cb4c" />

And for dessert, you can even switch the entire app to dark mode! click the settings button and then choose the toggle:
<img width="393" height="167" alt="image" src="https://github.com/user-attachments/assets/6d323726-e81c-4c81-a387-b6a866a2d8be" />
And now everything will be in dark mode!
<img width="1895" height="785" alt="image" src="https://github.com/user-attachments/assets/ee2d843a-5e64-450c-bcd5-c246c7a00e9a" />
<img width="1829" height="808" alt="image" src="https://github.com/user-attachments/assets/1bf030a2-43e5-46c6-abe4-4508281f7158" />
<img width="1891" height="810" alt="image" src="https://github.com/user-attachments/assets/7f13a2e7-9a25-4187-bef5-f1d698f82825" />

Feel free to discover our app and enjoy!
