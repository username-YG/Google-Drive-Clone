import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import "./TopBar.css"
import settings from "../../assets/settings.png"
import question from "../../assets/question.png"
import search from "../../assets/search.png"
import lines from "../../assets/lines.png"

const navigate = useNavigate();

const supportMenuItems = [
  {
    text: "Project readme",
    onClick: () => openLink(githubLink)
  },
  {
    text: "Google drive help",
    onClick: () => openLink(googleHelpLink)
  }
]

const settingsMenuItems = [
  {
    text: "Display settings",
    onClick: () => navigate("/settings#Display")
  },
  {
    text: "User settings",
    onClick: () => navigate("/settings#User")
  }
]

const barButtons = [
  {
    title: "Support",
    menuItems: <SimplePopup supportMenuItems/>,
    img: question,
  },
  {
    title: "Settings",
    menuItems: <SimplePopup settingsMenuItems/>,
    img: settings,
  },
  {
    title: "Account",
    menuItems: <ProfilePopup/>,
    img: "",
  }
]

const githubLink = "https://github.com/username-YG/Google-Drive-Project-ASP"
const googleHelpLink = "https://support.google.com/drive/?hl=en#topic=14950478"

function openLink(url) {
  window.open(url);
}

function ProfilePopup() {

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

function SimplePopup(items) {
  return (
    <ul className="item-menu">
      {items.map((item) => (
        <li className="item-menu-item" onClick={item.onClick}>{item.text}</li>
      ))}
    </ul>
  )
}

function BarListItem({ title, menuItems, img }) {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);

  const closePopup = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) setIsOpen(false);
  }

  useEffect(() => {
    if (isOpen) document.addEventListener("mousedown", closePopup);
    return () => document.removeEventListener("mousedown", closePopup);
  }, [isOpen]);

  return (
    <li ref={popupRef}>
      <a className="icon-button" title={title} onClick={() => setIsOpen(!isOpen)}>
        {img ?
          <img src={img}/> :
          <div className="no-profile-pic">{title[0]}</div>
        }
      </a>
      {isOpen && menuItems}
    </li>
  )
}

function TopBarList() {
  return (
    <nav class="bar-list">
      <ul>
        {barButtons.map((item) => (
            <BarListItem title={item.title} menuItems={item.menuItems} img={item.img}/>
        ))}
      </ul>
    </nav>
  )
}

function SearchBar() {
  return (
    <div class="search-bar">
      <img title="Search" class="search-icon" src={search}/>
      <input type="text" placeholder="Search in Drive" class="search"/>
      <img title="Advanced search" class="search-icon" src={lines}/>
    </div>
  )
}

function TopBar() {
  return (
    <div class="top-bar">
      <SearchBar/>
      <TopBarList />
    </div>
  )
}

export default TopBar
