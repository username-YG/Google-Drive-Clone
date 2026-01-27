import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

export default function getBaseUrl() {
    const hostIp = Constants.expoConfig?.hostUri?.split(':')[0] || 'localhost';
    const port = Constants.expoConfig.extra.VITE_WEB_PORT || 3000;
    return `http://${hostIp}:${port}/api/`;
}

export async function searchItems(query) {

  const token = SecureStore.getItem("token");
  const response = await fetch(getBaseUrl() + "search/" + query, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  if (response.status === 201 || response.status === 200) {
    const data = await response.json();
    return data
  } else {
    return []
  }

}

// Gets the all files and folders from the server
export async function getFiles(url, filter, router, withContent) {
  
  const hostIp = Constants.expoConfig?.hostUri?.split(':')[0] || 'localhost';
  const port = Constants.expoConfig.extra.VITE_WEB_PORT || 3000;

  const token = SecureStore.getItem("token");
  const response = await fetch(`http://${hostIp}:${port}/api${url}`, {
    'method': 'GET',
    'headers': {
      'Content-Type': 'application/json',
      'authorization': 'bearer ' + token,
      'filter': filter,
      "withcontent": withContent
    },
  });

  if (response.status === 200) {
    return await response.json();
  }

  // If the user's token doesn't exist or invalid, we send to login
  if (response.status === 404 || response.status === 403 || response.status === 401) {
    router.replace('/login/username');
  }

}

export async function getFile(id, withcontent) {

  const token = SecureStore.getItem("token")
  const response = await fetch(getBaseUrl() + "files/" + id, {
    'method': 'GET',
    'headers': {
      'Content-Type': 'application/json',
      'authorization': 'bearer ' + token,
      'withcontent': withcontent
    },
  });

  if (response.status === 200) {
    return await response.json();
  }

}

export async function getUser(setUser) {

  const token = SecureStore.getItem("token")
  const id = SecureStore.getItem("id");

  const response = await fetch(getBaseUrl() + "users/" + id, {
    'method': 'GET',
    'headers': {
      'Content-Type': 'application/json',
      'authorization': 'bearer ' + token
    },
  });

  if (response.status === 200) {
    const data = await response.json();
    setUser(data);
  }
}

export async function starItem(fileId, toStar) {

  const token = SecureStore.getItem("token")
  const response = await fetch(getBaseUrl() + "files/" + fileId, {
    'method': 'PATCH',
    'headers': {
      'Content-Type': 'application/json',
      'authorization': 'bearer ' + token
    },
    'body': JSON.stringify({
      "starred": toStar
    })
  });

}

export async function trashItem(id, toTrash) {

  const token = SecureStore.getItem("token")
  const response = await fetch(getBaseUrl() + "files/" + id, {
    'method': 'PATCH',
    'headers': {
      'Content-Type': 'application/json',
      'authorization': 'bearer ' + token
    },
    'body': JSON.stringify({
      "trashed": toTrash
    })
  });

  if (response.status === 403) {
    const pid = SecureStore.getItem("id")
    await unshareWithUser(id, pid);
  }

}

export async function deleteItem(id) {

  const token = SecureStore.getItem("token")
  const response = await fetch(getBaseUrl() + "files/" + id, {
    'method': 'DELETE',
    'headers': {
      'Content-Type': 'application/json',
      'authorization': 'bearer ' + token
    }
  });

}

export async function renameItem(fileId, name) {

  const token = SecureStore.getItem("token")
  const response = await fetch(getBaseUrl() + "files/" + fileId, {
    'method': 'PATCH',
    'headers': {
      'Content-Type': 'application/json',
      'authorization': 'bearer ' + token
    },
    'body': JSON.stringify({
      "name": name
    })
  });

}

export async function moveItem(fileId, newParentId) {

  const token = SecureStore.getItem("token")
  const response = await fetch(getBaseUrl() + "files/" + fileId, {
    'method': 'PATCH',
    'headers': {
      'Content-Type': 'application/json',
      'authorization': 'bearer ' + token
    },
    'body': JSON.stringify({
      "parentId": newParentId
    })
  });

}

export async function getAllFolders() {
  
  const token = SecureStore.getItem("token")
  const response = await fetch(getBaseUrl() + "files", {
    'method': 'GET',
    'headers': {
      'Content-Type': 'application/json',
      'authorization': 'bearer ' + token,
      'filter': "ALL LEVELS, NOT TRASHED, FOLDER"
    },
  });

  if (response.status === 200) {
    const data = await response.json();
    return data;
  }
  return [];

}

export async function getUserById(userId) {

  const token = SecureStore.getItem("token");
  const response = await fetch(getBaseUrl() + "users/" + userId, {
    'method': 'GET',
    'headers': {
      'Content-Type': 'application/json',
      'authorization': 'bearer ' + token
    },
  });

  if (response.status === 200) {
    return await response.json();
  }
  return null;
}


export async function unshareWithUser(fileId, pid) {

  const token = SecureStore.getItem("token")
  const response = await fetch(getBaseUrl() + `files/${fileId}/permissions/${pid}`, {
    'method': 'DELETE',
    'headers': {
      'Content-Type': 'application/json',
      'authorization': 'bearer ' + token
    }
  });
  
}

export async function updatePermission(fileId, userId, role) {

  const token = SecureStore.getItem("token");
  const response = await fetch(getBaseUrl() + `files/${fileId}/permissions/${userId}`, {
    'method': 'PATCH',
    'headers': {
      'Content-Type': 'application/json',
      'authorization': 'bearer ' + token
    },
    'body': JSON.stringify({
      'role': role
    })
  });

}

export async function shareWithUser(fileId, username) {

  const token = SecureStore.getItem("token");
  const response = await fetch(getBaseUrl() + `files/${fileId}/permissions`, {
    'method': 'POST',
    'headers': {
      'Content-Type': 'application/json',
      'authorization': 'bearer ' + token
    },
    'body': JSON.stringify({
      'username': username,
      'role': "reader"
    })
  });

  if (response.status === 404 || response.status === 400) {
    const data = await response.json();
    if (data.error === "Permission already exists") return "The user is already shared!";
    if (data.error === "User in body not found" || data.error === "Missing args") return "User doesn't exists!";
  }

}

export async function createFolder(name, parentId) {

  if (!name) name = "New Folder";
  if (!parentId) parentId = null;

  const token = SecureStore.getItem("token")
  const response = await fetch(getBaseUrl() + "files", {
    'method': 'POST',
    'headers': {
      'Content-Type': 'application/json',
      'authorization': 'bearer ' + token
    },
    'body': JSON.stringify({
      "name": name,
      "isFolder": true,
      "parentId": parentId
    })
  });
}