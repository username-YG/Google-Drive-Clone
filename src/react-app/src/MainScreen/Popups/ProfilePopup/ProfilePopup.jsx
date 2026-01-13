import { useState, useEffect } from "react"
import { getUser } from "../PopupLogic.js"

import "./ProfilePopup.css"

function ProfilePopup() {

  const [user, setUser] = useState(null);
  useEffect(() => {
    getUser(setUser)
  }, []);

  // User details
  const username = user?.username;
  const displayName = user?.displayName;
  const profilePic = user?.profilePic || "";
  if (!username && !displayName) { return (<></>) }

  { /* Displays the user's details in a screen like google's */ }
  { /* When there is no profile pic it shows one letter like in google */ }
  return (
    <div className="profile-menu">
      <div className="profile-gmail">{username}</div>
      {profilePic ? (
        <img className="profile-image" src={`${profilePic}`} />
      ) : (
        <div className="profile-no-image">{displayName ? displayName[0] : "?"}</div>
      )}
      <div className="profile-name">Hi, {displayName}!</div>
      <button className="switch-account-button" onClick={() => window.open("/login", "_blank")}>Use another account</button>
    </div>
  )
}

export default ProfilePopup