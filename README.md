# Google Drive System
# Advanced System Programming - Exercise 4

## Project Overview - Google Drive Application
This project is a smart web application designed to emulate the core functionality and user experience of Google Drive. It is built as a modern Single Page Application that seamlessly integrates an interactive user interface with a dynamic backend server for real-time data management.

### System Architecture:
#### Frontend (React):
- **Component-Based Design:** The interface is built using React, where every element (Sidebar, File Grid, Preview Overlay) is an independent component managing its own state.  
- **Client-Side Routing:** We utilized React Router to ensure the app loads once, allowing smooth transitions between Login, Registration, and the Main Dashboard without page refreshes.  
- **Dynamic Theming:** Advanced CSS implementation supports a full Light/Dark Mode toggle using CSS variables for high contrast and readability and an apealing display similar to the one in Google Drive.  

#### Backend (Node.js/Express and CPP server):
- **RESTful API:** A web-server-side logic layer that manages all business operations.  
- **Secure Authentication:** User identity is verified via JWT (JSON Web Tokens), ensuring only authorized users can access their private data.  
- **Dynamic Fetching:** All displayed contents (filenames, types, creation dates) are fetched asynchronously from the server; no hard-coded.  
- **MVC arcitecture and connection to the CPP-server:** An MVC arcitecture to support certain client requests in the web that require fetches from the CPP server which server as an item (file and folder)
storage facility.  
- **HTTP requests format:** All the communcation is handled with an HTTP requests as well as responses and status codes.  

### How It Works:
- **Security & Access:** Users can register (sign up) with validated credentials whose validation is enforced both on the front-end (client-side) and on the back-end (server side), and log in, in case of an already existant user to receive a secure Token and go to the personal main page. Additionaly, after havig gone to the main page of the app, users can log/sign out and go back to the registration screen.  
- **Content Loading:** Upon entering the main screen, the app requests the specific list of files and folders belonging to that authenticated user from the back-end server.  
- **State Management:** Using React Hooks like useState and useRef, the UI updates instantly when a user creates, renames, or deletes an item without needing to reload the entire site. The system provides a convenient and handy set of file management tools.  
- **Hierarchical Management:** Users can create new folders and organize files as well as new folders within them to maintain a structured and nested workspace should they want to.  

### File Preview Viewer:
#### Double-clicking an item opens a professional Preview Overlay.
- **Text Files:** View and edit raw text directly within the app with dynamic zoom capabilities.
- **Images:** High-quality image rendering with dynamic zoom capabilities.
- **PDFs:** Built-in support for viewing PDF documents.
- **Zoom:** Users can zoom in and out the preview.
- **Toolbar:** Users can apply various actions, such as renaming, editing content, sharing, moving to..

### Advanced UI Interactions:
- **Selection:** Visual feedback for selected items to perform quick actions.
- **Action Menus:** Context-sensitive menus for file operations (Edit, Delete, Rename..).
- **Theme Customization:** A button to switch between Light and Dark themes, adjusting all UI elements from the sidebar to the file grid icons.
- **User Profile Integration:** The top bar displays the authenticated user’s display name and profile picture fetched from the server.
- **Search & Filtering:** A dynamic search bar allows users to locate specific files or folders by name and content in real-time and shows the fisrt several files that contain either in their content or name the string searched so far.
- **Permissions enforcement:** Users cannot perform actions on files and folders without the required permissions.

### Login, register, multiple users:
- If you are not signed in, the first page you see is the login page.
- Once you login you stay logged-in in this tab until you close it or click "sign out".
- If you want to login to another user just open the app a second tab.

## Explaining each screen
### Home screen
- Files and folders owned by me.
- Files and folders shared with me.
- Files from all levels, not just root.
- Doesn't show items that are in trash.

### My drive screen shows:
- Files and folders owned by me.
- Only files and folders on root level.
- Doesn't show items that are in trash.
- Clicking a folder automatically opens it in my drive.

### Shared screen shows:
- Files and folders shared with me.
- Items from all levels, not just root level.
- Doesn't show items that are in trash.

### Recent screen shows:
- Owned or shared files recently accessed.
- Doesn't show folders.
- Shows files from all levels, not just root level.
- Doesn't show files that are in trash.
- Recently is defined as 'today' and accessed is defined as created \ patched.

### Starred screen shows:
- Starred files and folders.
- Items from all levels, not just root level.
- Doesn't show items that are in trash .

### Trash screen shows:
- Trashed files and folders.
- Because of trashing logic, it shared items.
- Items from all levels, not just root level.

### After search screen shows:
- Files that contain the query in name \ content.
- Folders that contains the query in name.
- Shows both shared and owned items.
- Shows items from all levels, not just root.
- Doesn't show items that are in trash.

### Actions on files and folder:
- The user can rename, share, move to folder, star\unstar, trash\restore\delete files and folders.
- Users can downalod files, edit text files and swap images.
- Some actions require special permissions (owner, editor etc).
- When the owner trashes an item it goes to trash for all users it is shared with.
- If a user that is only shared with the file removes it, it disappears only for them and doesn't go to trash.
- The user can manage permissions in the share popup.
- You can only move items into folders you own.

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
7. You will start at the login page. Go to "create account", register, and then login to get enter home page.

Note: you can modify environment variables by writing before the command:
- APP_PORT - The port the CPP server listens to 
- APP_PATH - The path the files are saved to
- WEB_PORT - The port the Web server listens to
- REACT_PORT - The port the React server listens to
- MAX_CLIENTS - The maximal number of clients that can wait in the queue to the server concurrently
- MAX_CLIENTS_AT_ONCE - The maximal number of clients the server can deal with concurrently

For example: REACT_PORT=4000 docker compose up --build react-app

Note: you can run all the servers with one line using the command:
```
docker compose up --build react-app server web-server
``` 

## Running Examples:
First of all, entering the site requires you to log in:
<img width="1875" height="812" alt="image" src="https://github.com/user-attachments/assets/99a3d656-e190-4698-8928-72c66d120363" />

If you don't have an account yet, you can press "Create account" and you will be moved to this Registeration screen:
<img width="1855" height="810" alt="image" src="https://github.com/user-attachments/assets/d4826053-c3d5-46e2-8244-4ee436418ea2" />

After finishing Registration, you'll return to the Login screen and now sign in with the new account you created.
Now, after signing in, this is the Main App page:
<img width="1905" height="832" alt="image" src="https://github.com/user-attachments/assets/5e9644eb-7c28-4d89-ab9e-5afff4ea4bcf" />

To upload new files/folders (or create folders) you can press the button "+ New" from the side bar and you'll see this:
<img width="609" height="352" alt="image" src="https://github.com/user-attachments/assets/1caf5610-b40c-4b44-a1dc-239013c9732d" />

For uploading files/folders, pressing on the button will open your local files browser and you can choose from it:
<img width="1049" height="707" alt="image" src="https://github.com/user-attachments/assets/b90ea47f-e101-4782-817a-8d54bbcbb6c6" />

After adding some files and create a folder for example, the screen looks like that:
<img width="1116" height="603" alt="image" src="https://github.com/user-attachments/assets/6fca5e22-e25e-474c-a3b5-c937f832788b" />
<img width="1890" height="834" alt="image" src="https://github.com/user-attachments/assets/a86b3ae6-d3ee-4fc9-a642-163980b60bf4" />


You can press each of the files to open a preview of it:
<img width="1862" height="831" alt="image" src="https://github.com/user-attachments/assets/a83e2f30-b035-4f91-b5a9-5440fa231f02" />

You can see the bar with all of the options mentioned above at the top, and the zoom bar at the bottom:
<img width="1835" height="825" alt="image" src="https://github.com/user-attachments/assets/0fa8dd6f-2424-4c34-b1a0-21ab070ec531" />

For example, this is what pressing on the Edit text button looks like:
<img width="1863" height="819" alt="image" src="https://github.com/user-attachments/assets/ab5c4d12-e3bb-45b9-93fa-7662837ddcea" />
<img width="1849" height="832" alt="image" src="https://github.com/user-attachments/assets/7dfa170d-cd3f-4fb9-9c10-b9a5f1f31836" />

You can also move files to different folders:
<img width="1845" height="831" alt="image" src="https://github.com/user-attachments/assets/ec551403-1dc1-459b-bac9-49affa45c864" />
<img width="1891" height="812" alt="image" src="https://github.com/user-attachments/assets/0ea5b327-4dd9-43c6-801a-16540d19b19e" />

And even share files with other users! :
<img width="1860" height="830" alt="image" src="https://github.com/user-attachments/assets/7a0de9f6-46b4-4f8b-babf-ab58165b626e" />
<img width="1869" height="823" alt="image" src="https://github.com/user-attachments/assets/f74dd75b-dfa0-4b89-984d-623b9bd80676" />

To exit preview mode, you can press on the close button (X) on the left-top edge, or just press the dark background outside the file itself.

You can also click the 3 dots button on each file to open it's menu with similar options but without entering preview mode:
<img width="1667" height="723" alt="image" src="https://github.com/user-attachments/assets/b4d0cad9-c98a-49f2-8b44-62b1037793a7" />

You also have at the side bar several pages with unique attributes:

Home: The home page of the app, you can see there all the files you have access to:
<img width="1554" height="695" alt="image" src="https://github.com/user-attachments/assets/71b97c9c-a3b2-4755-a0c8-3423338efd64" />

My drive: Presents only the files you are the owner of.

Shared with me: Presents all the files that other users gave you permission to:
<img width="1900" height="824" alt="image" src="https://github.com/user-attachments/assets/ee2ede19-4d47-4e08-85e4-273fb48a579f" />

Recent: Presents the files you opened recently.

Starred: pressing the "Add to starred" button for a file will allow you to see it on the Starred page:
<img width="400" height="441" alt="image" src="https://github.com/user-attachments/assets/51f9ec7e-4ce9-4514-88de-6154403bf5d3" />
<img width="1880" height="799" alt="image" src="https://github.com/user-attachments/assets/27fd5522-e717-43a1-8ef5-fb3ad49be95d" />

Trash: Presents all the files you sent to trash. only from there you delete files permanently:
<img width="1134" height="659" alt="image" src="https://github.com/user-attachments/assets/5cae807a-6fdf-4607-939d-fe5453f0271d" />
<img width="772" height="566" alt="image" src="https://github.com/user-attachments/assets/69c2d9c7-f846-4c1b-a96c-00404009bb1a" />
<img width="739" height="543" alt="image" src="https://github.com/user-attachments/assets/7cb0e3bf-cf72-4f44-9acb-ac5253b2d888" />
<img width="1828" height="677" alt="image" src="https://github.com/user-attachments/assets/41dd8543-7be4-4d52-a23d-54feae6b2a47" />

Oh you think we're done? We have even more abilities!

Search bar: You can search files by their names (or even text files by their content):
<img width="1893" height="757" alt="image" src="https://github.com/user-attachments/assets/33e87b43-3843-429d-965c-40c2b0f44a30" />

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
