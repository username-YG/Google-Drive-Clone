import { useNavigate } from "react-router-dom";

import "./ProfilePopup.css"

function ProfilePopup() {

  const navigate = useNavigate();
  const username = "username@gmail.com";
  const displayName = "displayName";

  return (
    <div className="profile-menu">
      <div className="profile-gmail">{username}</div>
      <div className="profile-image">{displayName[0]}</div>
      <div className="profile-name">Hi, {displayName}!</div>
      <button className="manage-button" onClick={() => {navigate("/settings#User")}}>Manage your account</button>
    </div>
  )
}

export default ProfilePopup