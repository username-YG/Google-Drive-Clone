# ☁️ Cloud Storage System

<div align="center">

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![C++](https://img.shields.io/badge/C++-00599C?style=for-the-badge&logo=cplusplus&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-FB015B?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)

</div>

A full-stack cloud storage solution mimicking Google Drive's core functionality. Built with a **C++ Storage Server**, **Node.js API**, **React Website**, and **React Native Mobile App**.

> **Disclaimer:** This project is strictly a personal, educational project. It is not affiliated with, endorsed by, sponsored by, or in any way associated with Google or Google Drive. All trademarks belong to their respective owners.

---

## 📚 Documentation

Everything you need is in our detailed guides:  
👉 [Full documentation](./wiki/README.md)

| Guide | Description |
|-------|-------------|
| 🚀 [Running Instructions](./wiki/README.md#-running-instructions) | Quick setup with Docker |
| 🖥️ [Website Guide](./wiki/documentation/website.md) | Complete website guide |
| 📱 [Mobile Guide](./wiki/documentation/mobile.md) | Complete mobile app guide |
| 🛠️ [API Reference](./wiki/documentation/API.md) | Backend API documentation |

---

## 🏗️ Architecture

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

**Components:**
- 🗄️ **C++ Storage Server** - Multithreaded file storage
- 🌐 **Node.js API** - Express backend with JWT authentication
- 💾 **MongoDB** - User and metadata storage
- ⚛️ **React Website** - Interactive web interface
- 📱 **React Native App** - Cross-platform mobile app

---

## ✨ Features

- **📂 File Management** - Upload, view and edit files.
- **📂 Folder Management** - Create and upload folders to handle many files.
- **🔐 JWT Authentication** - Users must prove their identity to access files
- **🤝 File Sharing** - Share files and folders with other users
- **⭐ Starred & Trash** - Star important files, restore deleted from trash
- **🔍 Search** - Search text in filename or content
- **📱 Web + Mobile** - Works on browsers and phones (Android/iOS)
- **🌗 Dark Mode** - Easy on the eyes at night

---

## 🚀 Quick Start

### What You Need
- **Docker Desktop** (must be running)
- **Git**
- **For mobile:** Expo Go app on your phone ([get it here](https://expo.dev/client)) or an emulator

### Step 1: Clone & Start Backend

```bash
git clone https://github.com/username-YG/Google-Drive-Clone
cd Google-Drive-Clone

# Start all backend services + website
docker-compose up --build mongodb storage-server web-server react-app
```

**Website will be at:** [http://localhost:5173/](http://localhost:5173/)

### Step 2: Run Mobile App

**Using Android Emulator:**
```bash
# Start the app
HOST_IP=10.0.2.2 docker-compose run --service-ports --rm mobile-app
```
Then in your emulator: Open Expo Go → Manual entry → Type `exp://10.0.2.2:8081`

**Using Your Phone:**

First, find your computer's local IP:
```bash
# On Windows
ipconfig

# Look for "IPv4 Address" (usually starts with 192.168 or 10.)
```

Then run:
```bash
HOST_IP=192.168.X.X docker-compose run --service-ports --rm mobile-app
```
*(Replace `192.168.X.X` with your actual IP)*

Scan the QR code with Expo Go and you're in!

> **Note:** Your phone and computer must be on the same WiFi network

---

## 📸 Screenshots

### Web Interface - File Management
<img width="600" alt="Main Dashboard" src="https://github.com/user-attachments/assets/a86b3ae6-d3ee-4fc9-a642-163980b60bf4" />

### File Preview & Sharing
<img width="600" alt="File Preview" src="https://github.com/user-attachments/assets/7dfa170d-cd3f-4fb9-9c10-b9a5f1f31836" />
<img width="600" alt="Sharing System" src="https://github.com/user-attachments/assets/43ac137a-8b6b-4eee-a89c-44be259e8d9e" />

### Mobile App
<img width="180" alt="Mobile Files" src="https://github.com/user-attachments/assets/8fa628ac-d904-4a78-a3cb-0dfcef7b8dd2" />
<img width="180" alt="Mobile Preview" src="https://github.com/user-attachments/assets/6667b5ad-c956-42c3-9f25-a169912aee62" />
<img width="180" alt="Mobile Actions" src="https://github.com/user-attachments/assets/d8841eba-1d98-4bdf-baf8-0b4efad6a4ae" />
