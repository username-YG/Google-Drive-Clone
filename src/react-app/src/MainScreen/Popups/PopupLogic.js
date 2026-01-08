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

  const token = localStorage.getItem("token")
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

  const token = localStorage.getItem("token")
  const id = localStorage.getItem("id");

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

export async function trashItem(id) {

  const token = localStorage.getItem("token")
  const response = await fetch("http://localhost:3000/api/files/" + id, {
    'method': 'PATCH',
    'headers': {
      'Content-Type': 'application/json',
      'authorization': 'bearer ' + token
    },
    'body': JSON.stringify({
      "trashed": true
    })
  });

}