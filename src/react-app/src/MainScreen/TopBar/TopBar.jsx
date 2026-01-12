import { useNavigate } from 'react-router-dom';
import { SimpleMenuPopup  } from "../Popups/SimpleMenuPopup/SimpleMenuPopup.jsx"
import { useState, useRef, useEffect, useCallback } from 'react';
import { useOutsideClickListener, getUser, searchItems } from "../Popups/PopupLogic.js";

import settings from "../../../assets/settings.png"
import question from "../../../assets/question.png"
import search from "../../../assets/search.png"
import lines from "../../../assets/lines.png"
import logout from "../../../assets/logout.png"
import ProfilePopup from "../Popups/ProfilePopup/ProfilePopup.jsx"
import SearchPopup from "../Popups/SearchPopup/SearchPopup.jsx"

import "./TopBar.css"

const githubLink = "https://github.com/username-YG/Google-Drive-Project-ASP"
const googleHelpLink = "https://support.google.com/drive/?hl=en#topic=14950478"

function openLink(url) {
  window.open(url);
}

function BarListItem({ title, menuItems, img, isProfile }) {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);
  useOutsideClickListener(isOpen, setIsOpen, popupRef)

  return (
      <li ref={popupRef}>
        <a className="icon-button" title={title} onClick={() => setIsOpen(!isOpen)}>
          {img ?
              <img id={isProfile ? "profile-pic" : "reguler-icon"} src={img} alt={title} /> :
              <div className="no-profile-pic">{title[0]}</div>
          }
        </a>
        {isOpen && menuItems}
      </li>
  )
}

function TopBarList({ toggleDarkMode, darkMode }) {

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
      text: darkMode ? "Toggle light mode" : "Toggle dark mode",
      onClick: () => {
        toggleDarkMode();
      }
    }
  ]

  const logoutMenuItems = [
    {
      text: "Sign out",
      onClick: () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("id");
        navigate("/login");
      }
    },
    {
      text: "Create new account",
      onClick: async () => {
        navigate("/register");
      }
    }
  ]

  const barButtons = [
    {
      title: "Support",
      menuItems: <SimpleMenuPopup items={supportMenuItems}/>,
      img: question,
    },
    {
      title: "Settings",
      menuItems: <SimpleMenuPopup items={settingsMenuItems}/>,
      img: settings,
    },
    {
      title: "Log out",
      menuItems: <SimpleMenuPopup items={logoutMenuItems}/>,
      img: logout,
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
            <BarListItem key={i} title={item.title} menuItems={item.menuItems} img={item.img} isProfile={item.title === "Account"} />
        ))}
      </ul>
    </nav>
  )
}

function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const navigate = useNavigate();

  const popupRef = useRef(null);
  useOutsideClickListener(() => results.length > 0, () => setResults([]), popupRef)
  const searchQuery = async (query) => {
    if (!query.trim()) {
      setResults([])
      return
    }

    try {
      const data = await searchItems(query)
      setResults(data)
    } catch (error) {
      console.error("Search failed:", error);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      searchQuery(query);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const onSearch = useCallback(() => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  }, [navigate, query]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') onSearch();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => { document.removeEventListener('keydown', handleKeyDown); };
  }, [navigate, query, onSearch]);

  return (
    <div className="search-bar">
      <img title="Search" className="search-icon" src={search} onClick={onSearch} alt="Search"/>
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

      <img title="Advanced search" className="search-icon" src={lines} alt="Options"/>
    </div>
  )
}

function TopBar({ toggleDarkMode, darkMode }) {
  return (
    <div className="top-bar">
      <SearchBar/>
      <TopBarList toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
    </div>
  )
}

export default TopBar
