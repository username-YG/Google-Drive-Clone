# Google Drive System 
## Drive Mobile App

This mobile application is a high-performance cloud storage solution designed to bring the full Google Drive experience to mobile devices. Built using **React Native** and **Expo**, it delivers a native look and feel with seamless integration into the project's C++ and Node.js backend.

### System Architecture:
#### Frontend (React Native & Expo):
- **Native Navigation:** Uses `expo-router` for file-based routing, including a `(tabs)` layout for the main dashboard and stack navigation for the multi-step registration wizard.
- **Adaptive UI:** Custom-built components that automatically adjust their layout and styling for different screen sizes and orientations.
- **Dynamic Theming:** Deep integration of a `ThemeContext` that supports system-wide Dark Mode, updating everything from status bars to custom-drawn icons.

#### Integration Layer:
- **Unified API Logic:** The mobile app shares the same backend logic as the web platform. It communicates with the Node.js server using a central `_serverLogic.js` utility to handle authentication, file metadata, and binary transfers.
- **Mobile File System Bridge:** Uses native bridges to interact with the device’s file system and gallery for uploads.

### Key Mobile Features:
- **Multi-Step Onboarding:** A dedicated flow for registration, splitting the process into manageable steps: Username -> Password -> Profile Name -> Profile Picture.
- **Native File Viewer:** A specialized `file_viewer.js` component that handles high-fidelity rendering of images and text documents directly within the app's native environment.
- **Touch-Optimized Operations:** All file interactions are optimized for touch, featuring an `ActionMenu` triggered by native gestures.
- **Session Persistence:** Securely stores JWT tokens on the device to keep users logged in across app restarts.

---

## Explaining Each Screen

### 1. Home Screen
- Displays a unified view of all accessible items (Owned & Shared).
- Optimized list view with custom icons for Folders, Images, and Text files.

### 2. My Drive
- Shows only the items owned by the authenticated user at the root level.
- Supports folder navigation; tapping a folder opens its contents in a nested view.

### 3. Shared with Me
- A dedicated space for collaborative items. Shows files and folders shared by other users with specific permissions.

### 4. Starred & Recent
- **Starred:** Quick access to items marked as important.
- **Recent:** Automatically tracks and displays files accessed or modified today.

### 5. Trash
- The "Safety Net." Shows trashed items and provides native options to either **Restore** them or **Delete Permanently** from the C++ storage server.

### 6. Search Tab
- Features a real-time filtering bar. As you type, the app queries the server to find matches in both file names and text content.

---

## Technical File Operations
The mobile app supports the same robust operation set as the web:
- **Permissions:** The UI dynamically hides or shows actions (Edit, Delete, Share) based on the user's permission level (Owner, Editor, Viewer).
- **Sharing:** A dedicated mobile window allows searching for other users and assigning them permissions.
- **Organization:** The `MoveItemWindow` provides a tree-like navigation to select a destination folder.

---

## Running Instructions
Follow the entire Running Instructions part from the **[README](../README.md)**

---

## Running Examples
## Running Examples

### 1. Authentication & Onboarding
The app starts with a clean Login screen. New users are guided through a native multi-step registration process featuring a step-by-step wizard.

<p align="center">
  <img src="https://github.com/user-attachments/assets/cde0e9a3-0b6d-45ba-a03a-a41e7d022456" width="180" title="Login" />
  <img src="https://github.com/user-attachments/assets/9cbc3518-62e7-44f3-9f04-12b69e1b5056" width="180" title="Registration Wizard" />
</p>

### 2. Main Dashboard & Navigation
The main interface utilizes a native Bottom Tab bar for quick access to different sections. Each category features specialized empty-state illustrations.

<p align="center">
  <img src="https://github.com/user-attachments/assets/8fa628ac-d904-4a78-a3cb-0dfcef7b8dd2" width="180" title="Home Screen" />
  <img src="https://github.com/user-attachments/assets/bfbf69a0-fbda-44bc-bcc0-e32346bceddf" width="180" title="Tab Navigation" />
  <img src="https://github.com/user-attachments/assets/59af9e5e-c548-479c-a1d0-c9529c11a5f0" width="180" title="Folder View" />
</p>

### 3. File Operations & Context Menus
Interactions are touch-optimized. Tapping the action icon triggers a context menu for management tasks, including moving items through a directory tree.

<p align="center">
  <img src="https://github.com/user-attachments/assets/d8841eba-1d98-4bdf-baf8-0b4efad6a4ae" width="180" title="Action Menu" />
  <img src="https://github.com/user-attachments/assets/8f4d472b-d897-4c8f-8f3c-abcda7894b61" width="180" title="Rename Dialog" />
  <img src="https://github.com/user-attachments/assets/1553d3fb-6c51-43b6-818a-1e04f359345a" width="180" title="Move File Window" />
</p>

### 4. Search & Discovery
The dedicated search tab allows for real-time discovery of files across the entire drive, filtering by name and content.

<p align="center">
  <img src="https://github.com/user-attachments/assets/853d9a58-c9c3-448c-9910-c5a79cb1832f" width="180" title="Search Feature" />
</p>

### 5. Native Dark Mode
The entire application supports a high-contrast Dark Mode theme, providing a premium experience that respects system-wide preferences.

<p align="center">
  <img src="https://github.com/user-attachments/assets/893bcf7d-5371-41a2-95ba-3a246ab77d75" width="180" title="Dark Mode Login" />
  <img src="https://github.com/user-attachments/assets/380a22af-1132-477f-98ff-56141bd2152b" width="180" title="Dark Mode Home" />
  <img src="https://github.com/user-attachments/assets/0668cbb0-f072-46c9-a945-5de870ba623d" width="180" title="Dark Mode Settings" />
</p>

### Enjoy the mobile cloud experience!

