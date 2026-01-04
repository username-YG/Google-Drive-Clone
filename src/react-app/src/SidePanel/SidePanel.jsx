import { NavLink } from "react-router-dom";

import "./SidePanel.css"
import logo from "../../assets/logo.svg"
import house from "../../assets/house.png"
import book from "../../assets/book.png"
import people from "../../assets/people.png"
import clock from "../../assets/clock.png"
import star from "../../assets/star.png"
import trash from "../../assets/trash.png"

const listButtons = [
  {
    title: "Home",
    link: "/Home",
    img: house
  },
  {
    title: "My Drive",
    link: "/my-drive",
    img: book
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
  return (
    <div class="logo">
      <img src={logo}/>
      <span>Drive</span>
    </div>
  )
}

function NewItemButton() {
  return (
    <button class="new-item-button">
      <span id="plus-icon">+</span>
      New
    </button>
  )
}

function PanelListItem({ title, link, img }) {
  return (
    <li>
      <NavLink 
        to={link} 
        className={({ isActive }) => (isActive ? "active-link" : "")}>
        <img src={img} alt={title} />
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
