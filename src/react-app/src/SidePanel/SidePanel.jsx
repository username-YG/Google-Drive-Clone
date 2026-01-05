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
import folderplus from "../../assets/folderplus.png"
import fileup from "../../assets/fileup.png"
import folderup from "../../assets/folderup.png"

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

const InputNewFolderPopup = ({ toggle, createFolder }) => {
  const [name, setName] = useState("Untitled folder");
  const inputRef = useRef(null);

  const onCreateFolder = () => {
    createFolder(name);
    toggle();
  };

  return (
    <div className="new-folder-screen">
      <div className="new-folder-popup" onClick={(e) => e.stopPropagation()}>

        <h2 className="new-folder-title">New folder</h2>
        
        <input ref={inputRef} type="text" className="new-folder-input" value={name}
          onChange={(e) => setName(e.target.value)}/>
        
        <div className="new-folder-buttons">
          <button onClick={toggle}>Cancel</button>
          <button onClick={onCreateFolder}>Create</button>
        </div>

      </div>
    </div>
  );
};

function createFolder(name) {
  //
}

function NewItemPopup() {

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
    <ul className="new-item-menu" ref={popupRef}>

      <li className="new-item-menu-item" onClick={() => setIsOpen(!isOpen)}>
        <img src={folderplus}/>
        New folder
        {isOpen && <InputNewFolderPopup toggle={() => setIsOpen(!isOpen)} createFolder={createFolder}/>}
      </li>
      <hr />

      <li className="new-item-menu-item">
        <img src={fileup} />
        File upload
      </li>

      <li className="new-item-menu-item">
        <img src={folderup} />
        Folder upload
      </li>

    </ul>
  )
}

function NewItemButton() {

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
    <div className="new-item-div" ref={popupRef}>
      <button className="new-item-button" onClick={() => setIsOpen(!isOpen)}>
        <img id="plus" src={plus}/>New</button>
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
