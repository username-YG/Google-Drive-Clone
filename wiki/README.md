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
