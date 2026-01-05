import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';

import "./SidePanel.css"
import logo from "../../assets/logo.svg"
import plus from "../../assets/plus.png"
import house from "../../assets/house.png"
import drive from "../../assets/drive.png"
import people from "../../assets/people.png"
import clock from "../../assets/clock.png"
import star from "../../assets/star.png"
import trash from "../../assets/trash.png"

const listButtons = [
  {
    title: "Home",
    link: "/home",
    img: house
  },
  {
    title: "My Drive",
    link: "/my-drive",
    img: drive
  },
  {
    title: "Shared with me",
    link: "/shared-with-me",
    img: people
  },
  {
    title: "Recent",
    link: "/recent",
    img: clock
  },
  {
    title: "Starred",
    link: "starred/",
    img: star
  },
  {
    title: "Trash",
    link: "/trash",
    img: trash
  }
]

function Logo() {
  const navigate = useNavigate();
  return (
    <div class="logo" onClick={() => navigate("/home")}>
      <img title="Drive" src={logo} />
      <span>Drive</span>
    </div>
  )
}

function NewItemPopup() {
  return (
    <ul className="drive-menu">
      <li className="menu-item"><i className="icon-folder" /> New folder</li>
      <hr />
      <li className="menu-item"><i className="icon-upload" /> File upload</li>
      <li className="menu-item"><i className="icon-folder-upload" /> Folder upload</li>
      <hr />
      <li className="menu-item"><i className="icon-docs" /> Google Docs</li>
      <li className="menu-item"><i className="icon-sheets" /> Google Sheets</li>
      <li className="menu-item">More</li>
    </ul>
  )
}

function NewItemButton() {

  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    const closePopup = (event) => { if (popupRef.current && !popupRef.current.contains(event.target)) setIsOpen(false) }
    document.addEventListener("mousedown", closePopup);
    return () => document.removeEventListener("mousedown", closePopup);
  }, []);

  return (
    <div className="new-item-div" ref={popupRef}>

      <button className="new-item-button" onClick={() => setIsOpen(!isOpen)}>
        <img id="plus" src={plus} />
        New
      </button>

      {isOpen && <NewItemPopup/>}

    </div>
  );
}

function PanelListItem({ title, link, img }) {
  return (
    <li>
      <NavLink 
        to={link} 
        className={({ isActive }) => (isActive ? "active-link" : "")}>
        <img src={img} />
        {title}
      </NavLink>
    </li>
  );
}

function PanelList() {
  return (
    <nav class="panel-list">
      <ul>
        {listButtons.map((item, i) => (
            <div>
              <PanelListItem title={item.title} link={item.link} img={item.img}/>
              {i % 3 === 2 && i !== listButtons.length - 1 && <br/>}
            </div>
        ))}
      </ul>
    </nav>
  )
}

function SidePanel() {
  return (
    <div class="side-panel">
      <Logo/>
      <NewItemButton/>
      <PanelList/>
    </div>
  )
}

export default SidePanel
