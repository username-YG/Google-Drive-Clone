import { useNavigate } from 'react-router-dom';
import { SimplePopup  } from "../Popups/SimpleMenuPopup/SimpleMenuPopup.jsx"
import { useState, useRef, useEffect } from 'react';
import { outsideClickListener, getUser  } from "../Popups/PopupLogic.js";
import SearchPopup from "../Popups/SearchPopup/SearchPopup.jsx"

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

  const [user, setUser] = useState(null);
  useEffect(() => {
    getUser(setUser)
  }, []);
  const profilePic = user?.profilePic || "";

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
      img: profilePic,
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
  
  const popupRef = useRef(null);
  outsideClickListener(() => { return results.length > 0 }, (flag) => { setResults([]) }, popupRef)

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
        <ul className="search-results" ref={popupRef}>
          <SearchPopup results={results} />
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
