import { useEffect } from 'react';

export function outsideClickListener(isOpen, setIsOpen, ref) {

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
  const response = await fetch("http://localhost:3000/api/files", {
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

  const response = await fetch("http://localhost:3000/api/users/" + id, {
    'method': 'GET',
    'headers': {
      'Content-Type': 'application/json',
      'authorization': 'bearer ' + token
    },
  });

  if (response.status == 200) {
    const data = await response.json();
    setUser(data);
  }

}

export async function trashItem(id, toTrash, pid) {

  const token = sessionStorage.getItem("token")
  const response = await fetch("http://localhost:3000/api/files/" + id, {
    'method': 'PATCH',
    'headers': {
      'Content-Type': 'application/json',
      'authorization': 'bearer ' + token
    },
    'body': JSON.stringify({
      "trashed": toTrash
    })
  });

  if (response.status == 403) {
    const pid = sessionStorage.getItem("id")
    const response = await fetch("http://localhost:3000/api/files/" + id + "/permissions/" + pid, {
      'method': 'DELETE',
      'headers': {
        'Content-Type': 'application/json',
        'authorization': 'bearer ' + token
      }
    });
  }

}

export async function renameItem(id, name) {

  const token = sessionStorage.getItem("token")
  const response = await fetch("http://localhost:3000/api/files/" + id, {
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
  const response = await fetch("http://localhost:3000/api/files/" + id, {
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
  const response = await fetch("http://localhost:3000/api/files/" + id, {
    'method': 'DELETE',
    'headers': {
      'Content-Type': 'application/json',
      'authorization': 'bearer ' + token
    }
  });

}

export async function searchItems(query) {

  const token = sessionStorage.getItem("token");
  const response = await fetch(`http://localhost:3000/api/search/${query}`, {
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
  const response = await fetch("http://localhost:3000/api/files/" + id, {
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
  const response = await fetch("http://localhost:3000/api/files", {
    'method': 'GET',
    'headers': {
      'Content-Type': 'application/json',
      'authorization': 'bearer ' + token,
      'filter': "ALL LEVELS, NOT TRASHED, FOLDER"
    },
  });

  if (response.status == 200) {
    const data = await response.json();
    return data;
  }
  return [];

}