# API documentation

### 🚀 Quick reference
| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/users` | POST | Create new user | No |
| `/api/users/:id` | GET | Get user info | No |
| `/api/tokens` | POST | Login / Get JWT token | No |
| `/api/files` | GET | List files in root | Yes |
| `/api/files` | POST | Create file/folder | Yes |
| `/api/files/:id` | GET | Get file/folder | Yes |
| `/api/files/:id` | PATCH | Update file/folder | Yes |
| `/api/files/:id` | DELETE | Delete file/folder | Yes |
| `/api/files/:id/permissions` | GET | Get permissions | Yes |
| `/api/files/:id/permissions` | POST | Add permission | Yes |
| `/api/files/:id/permissions/:pId` | PATCH | Update permission | Yes |
| `/api/files/:id/permissions/:pId` | DELETE | Remove permission | Yes |
| `/api/search/:query` | GET | Search files | Yes |
---

### 🔓 Authentication Header
HTTP requests that require authentication expect the following HTTP header to be present:

Authorization: Bearer \<JWT token\>

The JWT token is obtained by logging in via the `/api/tokens` endpoint.

If the header is missing, the server responds with **403 Forbidden** (Token required).  
If the token is invalid, the server responds with **401 Unauthorized** (Invalid Token).  
If the specified user in the token doesn't exist, the server responds with **404 Not found**.  

### 👥 Users

#### POST /api/users

Creates a new user in the system. The request must include a JSON body containing a username, password, display name, and profile picture URL.
All fields are required; usernames must be unique and follow the format of alphanumeric characters and dots (a-z, A-Z, 0-9, .). Passwords must be at least 8 characters long.

Request Body:
```json
{
  "username": "string",
  "password": "string",
  "displayName": "string",
  "profilePic": "string"
}
```

The user will also have a generated ID that is unique per user assigned to them.

Possible status codes:
- 201 Created: user created successfully. Returns the location header: /api/users/{ID}
- 400 Bad Request: missing or invalid request body.
- 404 Not Found: username (unique) already exists, or invalid username/password format.
- 500 Internal Server Error: should there be any malfunctioning in the servers' end.

#### GET /api/users/:id

Returns public information about a user with the specific id. The password is never returned.

Possible status codes:
- 200 OK: user information returned.
- 404 Not Found: user does not exist.
- 500 Internal Server Error: should there be any malfunctioning in the servers' end.

### 🔑 Authentication Tokens

#### POST /api/tokens

Authenticates a user and checks that they are signed in using the username and password and returns a JWT authentication token.

Request Body:
```json
{
  "username": "string",
  "password": "string"
}
```

Possible status codes:
- 201 Created: returns the JWT token and location header. Response: { "token": "jwt-token-string" }
- 400 Bad Request: missing or incomplete body request.
- 404 Not Found: non-existant user's information or incorrect password.
- 500 Internal Server Error: should there be any malfunctioning in the servers' end.

### 📁 Files and Directories

Important Note: all HTTP requests below require authentication via the Authorization header with a Bearer token.

#### GET /api/files

Returns all files and directories located in the root directory (i.e. in '/') that the authenticated user has access to.

Optional Headers:
- `filter`: Comma-separated list of filters to apply. Available filters:
  - `OWNS`: Files/folders owned by the user
  - `SHARES`: Files/folders shared with the user (not owned)
  - `STARRED`: Files/folders starred by the user
  - `TRASHED`: Files/folders in trash
  - `NOT TRASHED`: Files/folders not in trash
  - `FOLDER`: Only folders
  - `NOT FOLDER`: Only files
  - `RECENT`: Files/folders modified today
  - `ALL LEVELS`: Include files from all directory levels (not just root)
- `withcontent`: Set to "false" to exclude file content from response (default: true)

Example: `filter: OWNS, NOT TRASHED, FOLDER` - Returns owned, non-trashed folders

Possible status codes:
- 200 OK: returns list of all the files and directories in root (or filtered results).
- 403 Forbidden: missing or invalid authentication token.
- 404 Not Found: authenticated user does not exist.
- 500 Internal Server Error: should there be any malfunctioning in the servers' end.

#### POST /api/files

Creates a new file or directory. The creator automatically becomes the owner.

Request Body:
```json
{
  "name": "string",
  "content": "string",
  "isFolder": true | false,
  "parentId": "string" | null
}
```

Note: `content` is required for files (isFolder: false) but should be omitted for folders. Use `null` for parentId to create in root directory.

Possible status codes:
- 201 Created: file or directory created. Returns the location header: /api/files/{id}
- 400 Bad Request: missing header, body, or missing body fields.
- 403 Forbidden: missing/invalid authentication token or user isn't authorized to create in this folder.
- 404 Not Found: parent either does not exist or is not a directory, or authenticated user does not exist.
- 500 Internal Server Error: should there be any malfunctioning in the servers' end.

#### GET /api/files/:id

Returns metadata and content (the textual content for files and the files id's for directories) of the file or directory with the specified id.

Optional Headers:
- `filter`: For folders only - filters the folder's content. Same filter options as GET /api/files
- `withcontent`: Set to "false" to exclude file content from response (default: true)

Possible status codes:
- 200 OK: metadata and content returned.
- 403 Forbidden: missing/invalid authentication token or user isn't authorized to view this item.
- 404 Not Found: file or directory with the specified id does not exist, or authenticated user does not exist.
- 500 Internal Server Error: should there be any malfunctioning in the servers' end.

#### PATCH /api/files/:id

Updates an existing file or directory with the specified id. All fields are optional - only include fields you want to update.

Request Body:
```json
{
  "name": "string",
  "content": "string",
  "parentId": "string" | null,
  "starred": "string",
  "trashed": true | false,
  "timestamp": "Date"
}
```

Notes:
- `content`: Only applicable to files (ignored for folders)
- `starred`: Users this file is starred for.
- `trashed`: Move to/from trash
- `timestamp`: Update the last modified timestamp
- `parentId`: Move to a different parent folder (null for root)

Possible status codes:
- 204 No Content: file or directory updated successfully.
- 400 Bad Request: missing header/body, invalid fields, or all fields missing.
- 403 Forbidden: missing/invalid authentication token or user isn't authorized to update this item or the new parent.
- 404 Not Found: file or directory with the specified id does not exist, parent either does not exist or not a directory, or authenticated user does not exist. Moving a folder into itself or its descendants also causes this error.
- 500 Internal Server Error: should there be any malfunctioning in the servers' end.

#### DELETE /api/files/:id

Deletes a file or directory (recursively for directories) with the specified id. Only owners can delete files/folders.

Possible status codes:
- 204 No Content: file or directory deleted successfully.
- 403 Forbidden: missing/invalid authentication token or user isn't authorized to delete this item (not an owner).
- 404 Not Found: file or directory with the specified id does not exist, or authenticated user does not exist.
- 500 Internal Server Error: should there be any malfunctioning in the servers' end.

🔐 ### Permissions

Each file or directory maintains a permission list mapping users to roles.
Valid roles: owner, writer, commenter, reader.

Important Note: all HTTP requests below require authentication via the Authorization header with a Bearer token.

#### GET /api/files/:id/permissions

Returns all permissions associated with the file or directory with the specified id.

Possible status codes:
- 200 OK: permissions returned as an object mapping user IDs to roles.
- 403 Forbidden: missing/invalid authentication token or insufficient permissions (user must have some permission on the file).
- 404 Not Found: file or directory with the specified id does not exist, or authenticated user does not exist.
- 500 Internal Server Error: should there be any malfunctioning in the servers' end.

#### POST /api/files/:id/permissions

Creates a new permission for a user on the specified file or directory. Only owners can grant permissions.

Request Body:
```json
{
  "userID": "string",
  "role": "owner" | "writer" | "commenter" | "reader"
}
```

Possible status codes:
- 201 Created: permission created successfully.
- 400 Bad Request: missing header, body, or body fields.
- 403 Forbidden: missing/invalid authentication token or requester is not an owner of the file/directory.
- 404 Not Found: file or directory with the specified id does not exist, specified user does not exist, or authenticated user does not exist.
- 500 Internal Server Error: should there be any malfunctioning in the servers' end.

#### PATCH /api/files/:id/permissions/:pId

Updates an existing permission for a user (pId) on the specified file or directory. Only owners can update permissions.

Request Body:
```json
{
  "role": "owner" | "writer" | "commenter" | "reader"
}
```

Possible status codes:
- 204 No Content: permission updated successfully.
- 400 Bad Request: missing header, body, or role field.
- 403 Forbidden: missing/invalid authentication token or requester is not an owner of the file/directory.
- 404 Not Found: file or directory with the specified id does not exist, permission does not exist, specified user does not exist, or authenticated user does not exist.
- 500 Internal Server Error: should there be any malfunctioning in the servers' end.

#### DELETE /api/files/:id/permissions/:pId

Removes a permission for a user (pId) from the specified file or directory. Can be done by the owner or by the user removing their own permission.

Possible status codes:
- 204 No Content: permission deleted successfully.
- 403 Forbidden: missing/invalid authentication token or requester is not the owner and not removing their own permission.
- 404 Not Found: file or directory with the specified id does not exist, permission does not exist, specified user does not exist, or authenticated user does not exist.
- 500 Internal Server Error: should there be any malfunctioning in the servers' end.

### Search

Important Note: all HTTP requests below require authentication via the Authorization header with a Bearer token.

#### GET /api/search/:query

Returns all files and directories whose name or content contains the query string. Only returns items the user has permission to read.

Possible status codes:
- 200 OK: all files and directories matching returned.
- 403 Forbidden: missing/invalid authentication token.
- 404 Not Found: authenticated user does not exist.
- 500 Internal Server Error: should there be any malfunctioning in the servers' end.


## 📝 Notes
- The pId in permission endpoints is the same as the userID, like in Google Drive.
- If you want to create a new file under the root directory, insert "null" in the field asking for the parentID.
- Authentication is now handled via JWT tokens obtained from the `/api/tokens` endpoint.
- All error responses are returned as:
  ```json
  {
    "error": "Error description"
  }
  ```
- All requests and responses use JSON format.
- File responses always include metadata.