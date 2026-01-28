# Google Drive System

## 📑 Table of Contents

1. **[System Overview](#system-overview)**
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
---

## 📚 Detailed Documentation

- **[Website documentation](./documentation/website.md)**
- **[Mobile app documentation](./documentation/mobile.md)**
- **[API documentation](./documentation/API.md)**

---
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
### Step 1: Setup
Ensure Docker Desktop is running.
Clone the repository and enter the folder:
```bash
git clone https://github.com/username-YG/Google-Drive-Project-ASP
cd Google-Drive-Project-ASP
```
### Step 2: Backend and website
Start the web server, storage server, mongo and website:
```bash
docker-compose up --build mongodb storage-server web-server react-app
```
Enter the website at [http://localhost:5173/](http://localhost:5173/).  
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

### Step 3: Mobile app
**Option A - Emulator**  
```bash
HOST_IP=10.0.2.2 docker-compose run --service-ports --rm mobile-app
```
Start the emulator, Install Expo Go and insert the URL "exp://10.0.2.2:8081".  


**Option B - physical device**  
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
<img width="1855" height="810" alt="image" src="https://github.com/user-attachments/assets/d4826053-c3d5-46e2-8244-4ee436418ea2" />
<img width="1875" height="812" alt="image" src="https://github.com/user-attachments/assets/99a3d656-e190-4698-8928-72c66d120363" />

- Secure Authentication: Powered by JWT (JSON Web Tokens). Once logged in, the token is stored securely to maintain the session across refreshes.
- Validation: Real-time feedback for password strength and username availability.
<img width="1828" height="793" alt="image" src="https://github.com/user-attachments/assets/08d874e6-d84a-43fa-a9c2-d8819a437d33" />

### Upload and View Files
Efficient file management is at the core of the Google Drive project.
- Universal Upload: Supports various file types (Images, Text and PDF). Files are transmitted from the React frontend to the Node.js server, which then streams them to the C++ Storage Server.
<img width="1905" height="832" alt="image" src="https://github.com/user-attachments/assets/5e9644eb-7c28-4d89-ab9e-5afff4ea4bcf" />
<img width="609" height="352" alt="image" src="https://github.com/user-attachments/assets/1caf5610-b40c-4b44-a1dc-239013c9732d" />

- Grid & List Views: Organized layout showing file icons based on their type (e.g., custom icons for .pdf, .txt, and folders).
<img width="1890" height="834" alt="image" src="https://github.com/user-attachments/assets/a86b3ae6-d3ee-4fc9-a642-163980b60bf4" />

- Real-time Preview: Integrated file viewers allow users to view images and read document contents directly in the browser without downloading.
<img width="1862" height="831" alt="image" src="https://github.com/user-attachments/assets/a83e2f30-b035-4f91-b5a9-5440fa231f02" />
<img width="1849" height="832" alt="image" src="https://github.com/user-attachments/assets/7dfa170d-cd3f-4fb9-9c10-b9a5f1f31836" />

### File Operations
A rich set of features to manage your data, mimicking the full Google Drive experience:
- Search & Filter: A powerful search engine (implemented via a dedicated Search Controller) that finds files instantly by name or type.
<img width="1636" height="638" alt="image" src="https://github.com/user-attachments/assets/22a30d69-51e7-4eb2-98a4-5940b95a4418" />

File Organization: Create folders, move items between directories, and rename files on the fly.
<img width="1711" height="784" alt="image" src="https://github.com/user-attachments/assets/9fea0cdb-ecfc-466d-8d80-782787746332" />
<img width="1639" height="813" alt="image" src="https://github.com/user-attachments/assets/f08eb515-d03a-4488-b7b8-15e892b94f09" />
<img width="1708" height="825" alt="image" src="https://github.com/user-attachments/assets/cb5accc2-5282-4b7c-8691-e78f3f842e5c" />

Sharing System: Collaborate by sharing files with other registered users. Shared items appear instantly in the "Shared with me" section.
<img width="1792" height="790" alt="image" src="https://github.com/user-attachments/assets/43ac137a-8b6b-4eee-a89c-44be259e8d9e" />

Trash Management: Integrated safety net – files can be moved to the Trash and either restored or permanently deleted from the C++ storage.
<img width="849" height="754" alt="image" src="https://github.com/user-attachments/assets/8fea6577-ae5b-4b5d-be62-c480314523c5" />
<img width="1153" height="699" alt="image" src="https://github.com/user-attachments/assets/11dd84eb-25b7-4f37-8da0-b6e802519002" />

