import { useState, useEffect, useRef } from "react";
import { useOutsideClickListener, getUserById, updatePermission, shareWithUser, unshareWithUser, getFile } from "../PopupLogic.js";

import InputNamePopup from "../InputNamePopup/InputNamePopup.jsx";

import "./SharePopup.css";

function SharePopupButtons({file, reload}) {
  
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleSharing = async (newUsername) => {
    const msg = await shareWithUser(file.id, newUsername);
    if (msg) {
      alert(msg);
    } else {
      setIsAddOpen(false);
      reload();
    }
  };

  return (
    <div>
      <div className="share-buttons">
          <button onClick={() => setIsAddOpen(true)}>Add user</button>
      </div>

      {isAddOpen && (
            <InputNamePopup 
              toggle={() => setIsAddOpen(false)}
              onDone={handleSharing}
              currentName="example@gmail.com"
              doneText="Done"
              title="Add user" />)}
    </div>
  )

}

function SharedPopupItem({file, user, reload, toggle, reloadGrid}) {

  const roles = ["owner", "writer", "reader", "commenter", "none"];

  const handleEdit = async (e) => {
    const role = e.target.value;
    if (role === "none") {
      await unshareWithUser(file.id, user.ID);
    } else {
      await updatePermission(file.id, user.ID, role); 
    }
    reload();
    if (user.ID === sessionStorage.getItem("id")) {
      toggle();
      reloadGrid();
    }
  };

  return (
    <li className="share-list-item">
        
        <div className="share-user-left">
          {user.profilePic ? (
            <img className="share-user-image" src={user.profilePic} />
          ) : (
            <div className="share-user-no-image">{user.displayName ? user.displayName[0] : "?"}</div>
          )}
          <span className="share-user-name">{user.displayName}</span>
        </div>

        <select className="share-user-role" value={user.role} onChange={handleEdit} >
            {roles.map(role => (<option key={role} value={role}>{role}</option>))}
        </select>

    </li>
  )
}

function SharePopup({ file, toggle, reloadGrid }) {

  const [users, setUsers] = useState([]);
  const popupRef = useRef(null);
  useOutsideClickListener(true, toggle, popupRef);

  const loadUsers = async (file_) => {
    if (!file_?.permissions) return;
    
    const permittedUsers = [];
    for (const [userId, role] of Object.entries(file_.permissions)) {
      const data = await getUserById(userId);
      if (data) permittedUsers.push({ ...data, role });
    }
    setUsers(permittedUsers);
  };

  useEffect(() => { loadUsers(file) }, [file])

  const updateFile = async () => {
    const updatedFile = await getFile(file.id);
    await loadUsers(updatedFile);
  }

  return (
    <div className="share-screen">
      <div className="share-popup" onClick={(e) => e.stopPropagation()} onDoubleClick={(e) => e.stopPropagation()} ref={popupRef}>
        <h2 className="share-title">Share "{file.name}"</h2>
        
        <ul className="share-list">
          {users.map((user) => (<SharedPopupItem key={user.ID} file={file} user={user} reload={updateFile} toggle={toggle} reloadGrid={reloadGrid} />))}
        </ul>

        <SharePopupButtons file={file} reload={updateFile} />

      </div>
    </div>
  );
};

export default SharePopup;