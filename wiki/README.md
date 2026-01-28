# Google Drive System

## 📑 Table of Contents

1. **[System Overview](#-overview)**
2. **[Requirements](#-requirements)**
4. **[Running instructions](#-running-instructions)**
5. **Website guide**
    - **[Registration and Authentication](#5-registration-and-authentication)**
    - **[Upload and View Files](#6-upload-and-view-files)**
    - **[Files Operations](#7-files-operations)**
6. **Mobile guide**
    - **[Registration and Authentication](#registration-and-authentication)**
    - **[Upload and view files](#upload-and-view-files)**
    - **[Files operations](#files-operations)**

## 📚 Detailed Documentation

- **[Website documentation](./documentation/website.md)**
- **[Mobile app documentation](./documentation/mobile.md)**
- **[API documentation](./documentation/API.md)**

---
## 🧐 System Overview
<a id="-overview"></a>
### 🧩 Main components
The google drive system consists of the following components:
 1.  **Storage server:** Multithreaded C++ server to store files.
 2.  **MongoDB:** Database for storing users and files metadata.
 3.  **Web Server:** Node.js (Express) API.
 4.  **Website:** React interactive frontend for users.
 5.  **Mobile app:** React Native (Expo) mobile app for Android/iOS.

### 🛠️ Architecture Diagram
```mermaid
graph TD
    classDef user fill:#ffcc00,stroke:#333,stroke-width:2px,color:black;
    classDef front fill:#61dafb,stroke:#333,stroke-width:2px,color:black;
    classDef back fill:#90cbf9,stroke:#333,stroke-width:2px,color:black;
    classDef db fill:#81c784,stroke:#333,stroke-width:2px,color:black;

    User((User)):::user
    
    Mobile[Mobile App<br>React Native]:::front
    Web[Website<br>React]:::front
    
    API[Web Server<br>Node.js / Express]:::back
    
    DB[(MongoDB<br>Metadata)]:::db
    Storage[Storage Server<br>C++]:::db

    User -->|Uses| Mobile
    User -->|Uses| Web
    Mobile -->|HTTP Requests| API
    Web -->|HTTP Requests| API
    API -->|Manage metadata| DB
    API -->|Manage Files| Storage
```

### 🔥 Features

#### 📁 File Management
- [x] **Upload Files:** Users can upload files to store in the storage server.
- [x] **View & Download Files:** Users can view uploaded files and download them.
- [x] **File Management:** Files can be edited, renamed, stared, trashed and more.
- [X] **Files Sharing:** Users can share they files and folders with other users.
- [X] **Folder Management:** Users can create and upload folders to handle many files.

#### 🔐 User Registration & Authentication
- [x] **Authentication:** Secure user registration and login using JWT (JSON Web Tokens).
- [x] **Personal Storage:** Each user has their own private storage.
- [x] **Permission Control:** Users control file access and sharing permissions.

#### 📱 Cross-Platform Support
- [x] **Web:** Interactive UI design for web users.
- [x] **Mobile App:** Interactive mobile app for Android/iOs Users.
- [x] **CLI:** Can interact with the storage server directly from the command line.

## ✅ Requirements
<a id="-requirements"></a>
Before we start, make sure you have the following 

- **Git**
- **Docker**
- **Docker Compose**
- **Web browser**
- **Expo Go**
  - Install "Expo Go" on your physical phone.
  - OR set up an Emulator.
  - See [Expo setup guide](https://docs.expo.dev/get-started/set-up-your-environment/).

## 🚦 Running instructions
<a id="-running-instructions"></a>
### 💻 Step 1: Setup
Ensure Docker Desktop is running.
Clone the repository and enter the folder:
```bash
git clone https://github.com/username-YG/Google-Drive-Project-ASP
cd Google-Drive-Project-ASP
```
### 🌐 Step 2: Backend and website
Start the web server, storage server, mongo and website:
```bash
docker-compose up --build mongodb storage-server web-server react-app
```
Enter the website at [http://localhost:5173/](http://localhost:5173/).  
<details>
  <summary><strong>👇 You can also run each service separately</strong></summary>

  <br>

You can also run each service separately
  - **Start MongoDB:**
```bash
docker-compose up --build mongodb
```
  - **Start the storage server:**
```bash
docker-compose up --build storage-server
```
  - **Start the web server:**
```bash
docker-compose up --build web-server
```
  - **Start the website:**
```bash
docker-compose up --build react-app
```

<br>

</details>

### 📱 Step 3: Mobile app (Option A - Emulator)
```bash
HOST_IP=10.0.2.2 docker-compose run --service-ports --rm mobile-app
```
Start the emulator, Install Expo Go and insert the URL "exp://10.0.2.2:8081".  

<img width="600" alt="image" src="https://github.com/user-attachments/assets/1b7b25bb-9ab2-48f0-9c65-b80141cd89df" />     
<br>

### 📱 Step 3: Mobile app (Option B - physical device)
Your phone and computer must be on the same local network.
Find your computer's IP by running:
```bash
# If on Ethernet:
powershell.exe -Command "(Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias 'Ethernet').IPAddress"

# If on Wi-Fi:
powershell.exe -Command "(Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias 'Wi-Fi').IPAddress"

# Manually check:
ipconfig.exe
```
Run the mobile app (replace [YOUR_IP] with the address you found above)
```bash
HOST_IP=[YOUR_IP] docker-compose run --service-ports --rm --build mobile-app
```
Open Expo Go on your phone, scan the QR and enjoy!

---

## Website guide
The website is a smart web application designed to emulate the core functionality and user experience of Google Drive. It is built as a modern Single Page Application that seamlessly integrates an interactive user interface with a dynamic backend server for real-time data management.
We'll show here the main functionality and a more expanded explanation can be found at - **[Website documentation](./documentation/website.md)**

To run the website, follow the guide from the Running Instructions above.
Then, the website works like that:

### Registration and Authentication
The Web interface provides a secure and seamless onboarding process.
- Multi-step Registration: Users can create an account by providing a display name, username (the mail address), password, and a profile picture upload.
<img width="600" height="810" alt="image" src="https://github.com/user-attachments/assets/d4826053-c3d5-46e2-8244-4ee436418ea2" />
<img width="600" height="812" alt="image" src="https://github.com/user-attachments/assets/99a3d656-e190-4698-8928-72c66d120363" />

- Secure Authentication: Powered by JWT (JSON Web Tokens). Once logged in, the token is stored securely to maintain the session across refreshes.
- Validation: Real-time feedback for password strength and username availability.
<img width="600" height="793" alt="image" src="https://github.com/user-attachments/assets/08d874e6-d84a-43fa-a9c2-d8819a437d33" />

### Upload and View Files
Efficient file management is at the core of the Google Drive project.
- Universal Upload: Supports various file types (Images, Text and PDF). Files are transmitted from the React frontend to the Node.js server, which then streams them to the C++ Storage Server.
<img width="600" height="832" alt="image" src="https://github.com/user-attachments/assets/5e9644eb-7c28-4d89-ab9e-5afff4ea4bcf" />
<img width="600" height="352" alt="image" src="https://github.com/user-attachments/assets/1caf5610-b40c-4b44-a1dc-239013c9732d" />

- Grid & List Views: Organized layout showing file icons based on their type (e.g., custom icons for .pdf, .txt, and folders).
<img width="600" height="834" alt="image" src="https://github.com/user-attachments/assets/a86b3ae6-d3ee-4fc9-a642-163980b60bf4" />

- Real-time Preview: Integrated file viewers allow users to view images and read document contents directly in the browser without downloading.
<img width="600" height="831" alt="image" src="https://github.com/user-attachments/assets/a83e2f30-b035-4f91-b5a9-5440fa231f02" />
<img width="600" height="832" alt="image" src="https://github.com/user-attachments/assets/7dfa170d-cd3f-4fb9-9c10-b9a5f1f31836" />

### File Operations
A rich set of features to manage your data, mimicking the full Google Drive experience:
- Search & Filter: A powerful search engine (implemented via a dedicated Search Controller) that finds files instantly by name or type.
<img width="600" height="638" alt="image" src="https://github.com/user-attachments/assets/22a30d69-51e7-4eb2-98a4-5940b95a4418" />

File Organization: Create folders, move items between directories, and rename files on the fly.
<img width="600" height="784" alt="image" src="https://github.com/user-attachments/assets/9fea0cdb-ecfc-466d-8d80-782787746332" />
<img width="600" height="813" alt="image" src="https://github.com/user-attachments/assets/f08eb515-d03a-4488-b7b8-15e892b94f09" />
<img width="600" height="825" alt="image" src="https://github.com/user-attachments/assets/cb5accc2-5282-4b7c-8691-e78f3f842e5c" />

Sharing System: Collaborate by sharing files with other registered users. Shared items appear instantly in the "Shared with me" section.

<img width="600" height="790" alt="image" src="https://github.com/user-attachments/assets/43ac137a-8b6b-4eee-a89c-44be259e8d9e" />

Trash Management: Integrated safety net – files can be moved to the Trash and either restored or permanently deleted from the C++ storage.

<img width="600" height="754" alt="image" src="https://github.com/user-attachments/assets/8fea6577-ae5b-4b5d-be62-c480314523c5" />
<img width="600" height="699" alt="image" src="https://github.com/user-attachments/assets/11dd84eb-25b7-4f37-8da0-b6e802519002" />

## Mobile-App guide
### Registration and Authentication
The mobile application offers a native, step-by-step onboarding experience designed for small screens.

- Guided Registration: A clean, sequential flow that guides users through entering their username, password, display name, and selecting a profile picture from their gallery.
![Screenshot_2026-01-28-18-09-26-029_host exp exponent](https://github.com/user-attachments/assets/9cbc3518-62e7-44f3-9f04-12b69e1b5056)

- Native Authentication: Secure login persistence using local storage, ensuring users stay logged in between app sessions.
![Screenshot_2026-01-28-18-05-00-345_host exp exponent](https://github.com/user-attachments/assets/cde0e9a3-0b6d-45ba-a03a-a41e7d022456)

### Upload and View Files 
Optimized for on-the-go productivity, the mobile app provides full access to the cloud storage.
![Screenshot_2026-01-28-18-11-19-102_host exp exponent](https://github.com/user-attachments/assets/8fa628ac-d904-4a78-a3cb-0dfcef7b8dd2)
![Screenshot_2026-01-28-18-15-03-334_host exp exponent](https://github.com/user-attachments/assets/59af9e5e-c548-479c-a1d0-c9529c11a5f0)

- Mobile File Picker: Integrated with the device's native file system, allowing users to upload documents, images, and other media directly from their phone.
<img width="200" height="501" alt="image" src="https://github.com/user-attachments/assets/80f34703-e574-42ef-acea-6e1d1bc4a831" />

- Custom File Viewers: High-performance preview components for various formats (Images and Text) integrated directly into the app using a dedicated file Viewer.
![Screenshot_2026-01-28-18-17-09-327_host exp exponent](https://github.com/user-attachments/assets/6667b5ad-c956-42c3-9f25-a169912aee62)
![Screenshot_2026-01-28-18-17-20-349_host exp exponent](https://github.com/user-attachments/assets/8be88644-f480-469c-8372-5aeeac48510e)

Visual Navigation: A tab-based navigation system (Home, Starred, Shared, Files) with custom icons that clearly distinguish between different file categories.
![Screenshot_2026-01-28-18-18-18-313_host exp exponent](https://github.com/user-attachments/assets/bfbf69a0-fbda-44bc-bcc0-e32346bceddf)
![Screenshot_2026-01-28-18-18-29-475_host exp exponent](https://github.com/user-attachments/assets/df01ed18-96d3-44c4-b835-737961ab351f)

### Mobile File Operations
The app delivers a full suite of management tools via a mobile-optimized UI:

- Native Context Menus: Long-press or tap the "three dots" icon to trigger an ActionMenu, providing access to Rename, Share, Move, and Delete operations.
![Screenshot_2026-01-28-18-17-13-865_host exp exponent](https://github.com/user-attachments/assets/d8841eba-1d98-4bdf-baf8-0b4efad6a4ae)
![Screenshot_2026-01-28-18-20-06-255_host exp exponent](https://github.com/user-attachments/assets/8f4d472b-d897-4c8f-8f3c-abcda7894b61)
![Screenshot_2026-01-28-18-21-00-464_android](https://github.com/user-attachments/assets/f249051f-2e5b-4711-b9ae-42ecf2c40d6e)

- Shared Workspace: Real-time access to the "Shared with Me" section, allowing users to collaborate on documents while mobile.

- Efficient Organization: Users can create new folders or move files between directories using a specialized window built for touch interfaces.
![Screenshot_2026-01-28-18-11-47-717_host exp exponent](https://github.com/user-attachments/assets/1553d3fb-6c51-43b6-818a-1e04f359345a)

- Search Integration: A dedicated search tab with real-time filtering, making it easy to locate specific files within a large cloud directory.
![Screenshot_2026-01-28-18-21-12-936_host exp exponent](https://github.com/user-attachments/assets/853d9a58-c9c3-448c-9910-c5a79cb1832f)

#### Special Note - Dark Mode
Both website and app are supporting dark mode theme for the entire system(!):

click the settings button and then choose the toggle:

<img width="393" height="167" alt="image" src="https://github.com/user-attachments/assets/6d323726-e81c-4c81-a387-b6a866a2d8be" />

And now everything will be in dark mode!

<img width="600" height="785" alt="image" src="https://github.com/user-attachments/assets/ee2d843a-5e64-450c-bcd5-c246c7a00e9a" />
<img width="600" height="808" alt="image" src="https://github.com/user-attachments/assets/1bf030a2-43e5-46c6-abe4-4508281f7158" />
<img width="600" height="810" alt="image" src="https://github.com/user-attachments/assets/7f13a2e7-9a25-4187-bef5-f1d698f82825" />

And Also for the Mobile app:
![Screenshot_2026-01-28-18-22-37-094_host exp exponent](https://github.com/user-attachments/assets/893bcf7d-5371-41a2-95ba-3a246ab77d75)
![Screenshot_2026-01-28-18-21-41-811_host exp exponent](https://github.com/user-attachments/assets/380a22af-1132-477f-98ff-56141bd2152b)
![Screenshot_2026-01-28-18-21-57-525_host exp exponent](https://github.com/user-attachments/assets/0668cbb0-f072-46c9-a945-5de870ba623d)

### Enjoy our system!
