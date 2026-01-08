import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { getUser } from "../PopupLogic.js"

import "./ProfilePopup.css"

function ProfilePopup() {

  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser(setUser)
  }, []);

  const username = user?.username;
  const displayName = user?.displayName;
  const profilePic = user?.profilePic || "";
  if (!username && !displayName) { return (<></>) }

  return (
    <div className="profile-menu">
      <div className="profile-gmail">{username}</div>
      {profilePic ? (
        <img className="profile-image" src={`${profilePic}`} />
      ) : (
        <div className="profile-no-image">{displayName ? displayName[0] : "?"}</div>
      )}
      <div className="profile-name">Hi, {displayName}!</div>
      <button className="manage-button" onClick={() => {navigate("/settings#User")}}>Manage your account</button>
    </div>
  )
}

export default ProfilePopup