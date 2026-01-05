import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import "./TopBar.css"
import settings from "../../assets/settings.png"
import question from "../../assets/question.png"
import search from "../../assets/search.png"
import lines from "../../assets/lines.png"

const barButtons = [
  {
    title: "Support",
    popUp: <SupportPopup/>,
    img: question,
  },
  {
    title: "Settings",
    popUp: <SettingPopup/>,
    img: settings,
  },
  {
    title: "Account",
    popUp: <ProfilePopup/>,
    img: "",
  }
]

const githubLink = "https://github.com/username-YG/Google-Drive-Project-ASP"
const googleHelpLink = "https://support.google.com/drive/?hl=en#topic=14950478"

function openLink(url) {
  window.open(url);
}

function SupportPopup() {
  return (
    <ul className="item-menu">
      <li className="item-menu-item" onClick={() => openLink(githubLink)}>Project readme</li>
      <li className="item-menu-item" onClick={() => openLink(googleHelpLink)}>Google drive help</li>
    </ul>
  )
}

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

function SettingPopup() {
  const navigate = useNavigate();
  return (
    <ul className="item-menu">
      <li className="item-menu-item" onClick={() => {navigate("/settings#Display")}}>Display settings</li>
      <li className="item-menu-item" onClick={() => {navigate("/settings#User")}}>User settings</li>
    </ul>
  )
}

function BarListItem({ title, popUp, img }) {

  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    const closePopup = (event) => { if (popupRef.current && !popupRef.current.contains(event.target)) setIsOpen(false) }
    if (isOpen) document.addEventListener("mousedown", closePopup);
    return () => document.removeEventListener("mousedown", closePopup);
  }, [isOpen]);

  return (
    <li ref={popupRef}>
      <a className="icon-button" title={title} onClick={() => setIsOpen(!isOpen)}>
        {img ? <img src={img}/> : <div className="no-profile-pic">{title[0]}</div>}
      </a>
      {isOpen && popUp}
    </li>
  )
}

function TopBarList() {
  return (
    <nav class="bar-list">
      <ul>
        {barButtons.map((item) => (
            <BarListItem title={item.title} popUp={item.popUp} img={item.img}/>
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
