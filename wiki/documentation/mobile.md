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
Follow the entire running instructions from - **[README](./README.md)**
