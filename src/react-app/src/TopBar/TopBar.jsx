import { useState, useEffect, useRef, use } from 'react';
import { useNavigate } from 'react-router-dom';

import "./TopBar.css"
import settings from "../../assets/settings.png"
import question from "../../assets/question.png"
import search from "../../assets/search.png"
import lines from "../../assets/lines.png"
import docs from "../../assets/docs.png"
import txt from "../../assets/txt.png"
import notype from "../../assets/notype.png"
import image from "../../assets/image.png"
import pdf from "../../assets/pdf.png"
import folder from "../../assets/folder.png"

import outsideClickListener from "../SidePanel/SidePanel.jsx"

const githubLink = "https://github.com/username-YG/Google-Drive-Project-ASP"
const googleHelpLink = "https://support.google.com/drive/?hl=en#topic=14950478"

function openLink(url) {
  window.open(url);
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

function SimplePopup({items}) {
  return (
    <ul className="item-menu">
      {items.map((item, i) => (
        <li key={i} className="item-menu-item" onClick={item.onClick}>{item.text}</li>
      ))}
    </ul>
  )
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
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const icons = {
    "txt": txt,
    "docs": docs,
    "docx": docs,
    "notype": notype,
    "jpg": image,
    "jpeg": image,
    "png": image,
    "pdf": pdf
  }

  const searchQuery = async (query) => {
    if (!query.trim()) {
      setResults([])
      return
    }

    try {
      setLoading(true)

      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/search/${query}`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.status === 201 || response.status === 200) {
        const data = await response.json();
        setResults(data)
      } else {
        setResults([])
      }
    } catch (err) {}

    setLoading(false)
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      searchQuery(query);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="search-bar">
      <img title="Search" className="search-icon" src={search}/>
      <input 
        type="text" 
        value={query}
        placeholder="Search in Drive" 
        className="search"
        onChange={(e) => setQuery(e.target.value)}
      />

      {results.length > 0 && (
        <ul className="search-results">
          {results.slice(0,5).map((file) => (
            <li 
              key={file.id} 
              className="search-result-item"
              onClick={ () => {
                // navigating to the item

              }}
            > 
              <img className="search-result-icon" src={file.isFolder ? folder : icons[file.name.split('.').pop()] || icons["notype"]}/>
              <span className="search-result-name">
                {file.name}
              </span>
            </li>
          ))}
        </ul>
      )}

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