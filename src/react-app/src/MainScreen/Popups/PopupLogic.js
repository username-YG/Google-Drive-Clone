import {useEffect} from 'react';

function getBaseUrl() {
  const port = import.meta.env.VITE_WEB_PORT || 3000;
  return `http://localhost:${port}/api/`;
}

// This listener closes a popup when the user clicks outside it 
export function useOutsideClickListener(isOpen, setIsOpen, ref) {

  const closePopup = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsOpen(false);
    }
  }

  useEffect(() => {
    if (isOpen) document.addEventListener("mousedown", closePopup);
    return () => document.removeEventListener("mousedown", closePopup);
  }, [isOpen]);

}

export async function createFolder(name, parentId) {

  if (!name) name = "New Folder";
  if (!parentId) parentId = null;

  const token = sessionStorage.getItem("token")
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

export async function getUser(setUser) {

  const token = sessionStorage.getItem("token")
  const id = sessionStorage.getItem("id");

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

export async function trashItem(id, toTrash) {

  const token = sessionStorage.getItem("token")
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
    const pid = sessionStorage.getItem("id")
    await unshareWithUser(id, pid);
  }

}

export async function unshareWithUser(fileId, pid) {

  const token = sessionStorage.getItem("token")
  const response = await fetch(getBaseUrl() + `files/${fileId}/permissions/${pid}`, {
    'method': 'DELETE',
    'headers': {
      'Content-Type': 'application/json',
      'authorization': 'bearer ' + token
    }
  });
  
}

export async function renameItem(id, name) {

  const token = sessionStorage.getItem("token")
  const response = await fetch(getBaseUrl() + "files/" + id, {
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

export async function starItem(id, toStar) {

  const token = sessionStorage.getItem("token")
  const response = await fetch(getBaseUrl() + "files/" + id, {
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

export async function deleteItem(id) {

  const token = sessionStorage.getItem("token")
  const response = await fetch(getBaseUrl() + "files/" + id, {
    'method': 'DELETE',
    'headers': {
      'Content-Type': 'application/json',
      'authorization': 'bearer ' + token
    }
  });

}

export async function searchItems(query) {

  const token = sessionStorage.getItem("token");
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

export async function moveItem(id, newParentId) {

  const token = sessionStorage.getItem("token")
  const response = await fetch(getBaseUrl() + "files/" + id, {
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
  
  const token = sessionStorage.getItem("token")
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

export async function getFile(id, withcontent) {

  const token = sessionStorage.getItem("token")

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

export async function updateFile(id, updateData) {
  const token = sessionStorage.getItem("token");

  const response = await fetch(getBaseUrl() + "files/" + id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'authorization': 'bearer ' + token
    },
    body: JSON.stringify(updateData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update file");
  }

  return true;
}

export async function getUserById(id) {
  const token = sessionStorage.getItem("token");
  const response = await fetch(getBaseUrl() + "users/" + id, {
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

export async function updatePermission(fileId, userId, role) {

  const token = sessionStorage.getItem("token");
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

  const token = sessionStorage.getItem("token");
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