import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

function getBaseUrl() {
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
