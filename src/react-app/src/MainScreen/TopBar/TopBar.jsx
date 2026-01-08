import { useNavigate } from 'react-router-dom';
import { SimplePopup  } from "../Popups/SimpleMenuPopup/SimpleMenuPopup.jsx"
import { useState, useRef } from 'react';
import { outsideClickListener  } from "../Popups/PopupLogic.js";

import settings from "../../../assets/settings.png"
import question from "../../../assets/question.png"
import search from "../../../assets/search.png"
import lines from "../../../assets/lines.png"
import ProfilePopup from "../Popups/ProfilePopup/ProfilePopup.jsx"

import "./TopBar.css"

const githubLink = "https://github.com/username-YG/Google-Drive-Project-ASP"
const googleHelpLink = "https://support.google.com/drive/?hl=en#topic=14950478"

function openLink(url) {
  window.open(url);
}

function BarListItem({ title, menuItems, img }) {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);
  outsideClickListener(isOpen, setIsOpen, popupRef)

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
      menuItems: <SimplePopup items={supportMenuItems}/>,
      img: question,
    },
    {
      title: "Settings",
      menuItems: <SimplePopup items={settingsMenuItems}/>,
      img: settings,
    },
    {
      title: "Account",
      menuItems: <ProfilePopup/>,
      img: "",
    }
  ]

  return (
    <nav className="bar-list">
      <ul>
        {barButtons.map((item, i) => (
            <BarListItem key={i} title={item.title} menuItems={item.menuItems} img={item.img}/>
        ))}
      </ul>
    </nav>
  )
}

function SearchBar() {
  return (
    <div className="search-bar">
      <img title="Search" className="search-icon" src={search}/>
      <input type="text" placeholder="Search in Drive" className="search"/>
      <img title="Advanced search" className="search-icon" src={lines}/>
    </div>
  )
}

function TopBar() {
  return (
    <div className="top-bar">
      <SearchBar/>
      <TopBarList />
    </div>
  )
}

export default TopBar
