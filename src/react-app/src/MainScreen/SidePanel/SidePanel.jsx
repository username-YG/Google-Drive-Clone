import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from 'react';
import { outsideClickListener } from "../Popups/PopupLogic.js"

import NewItemPopup from "../Popups/NewItemPopup/NewItemPopup.jsx"
import UploadController from "../Popups/UploadItemPopup/UploadItemPopup.jsx"

import logo from "../../../assets/logo.svg"
import plus from "../../../assets/plus.png"
import house from "../../../assets/house.png"
import drive from "../../../assets/drive.png"
import people from "../../../assets/people.png"
import clock from "../../../assets/clock.png"
import star from "../../../assets/star.png"
import trash from "../../../assets/trash.png"

import "./SidePanel.css"

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
    <div className="logo" onClick={() => navigate("/home")}>
      <img title="Drive" src={logo} />
      <span>Drive</span>
    </div>
  )
}

function NewItemButton({ reload, setReload, onUploadFile, onUploadFolder }) {

  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);
  outsideClickListener(isOpen, setIsOpen, popupRef)

  return (
    <div className="new-item-div" ref={popupRef}>
      <button className="new-item-button" onClick={() => setIsOpen(!isOpen)}>
        <img id="plus" src={plus}/>New</button>
      {isOpen && <NewItemPopup
        reload={reload}
        setReload={setReload}
        onUploadFile={onUploadFile}
        onUploadFolder={onUploadFolder}
      />}
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
    <nav className="panel-list">
      <ul>
        {listButtons.map((item, i) => (
            <div key={i}>
              <PanelListItem title={item.title} link={item.link} img={item.img}/>
              {i % 3 === 2 && i !== listButtons.length - 1 && <br/>}
            </div>
        ))}
      </ul>
    </nav>
  )
}

function SidePanel( { reload, setReload } ) {

  const createChildren = ({ uploadFile, uploadFolder}) => {
    return (
      <NewItemButton
        reload={reload}
        setReload={setReload}
        onUploadFile={uploadFile}
        onUploadFolder={uploadFolder}
      />
  )};

  return (
    <div className="side-panel">
      <Logo/>
      <UploadController
        children={createChildren}
        reload={reload}
        setReload={setReload}
      />
      <PanelList/>
    </div>
  )
}

export default SidePanel
