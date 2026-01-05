import "./TopBar.css"
import settings from "../../assets/settings.png"
import question from "../../assets/question.png"
import search from "../../assets/search.png"
import lines from "../../assets/lines.png"

const barButtons = [
  {
    title: "Support",
    popUp: "",
    img: question,
  },
  {
    title: "Settings",
    popUp: "",
    img: settings,
  },
  {
    title: "Account",
    popUp: "",
    img: "",
  }
]

function BarListItem({ title, popUp, img }) {
  return (
    <li>
      <a className="icon-button" title={title}>
        {img ? <img src={img}/> : <div className="no-profile-pic">{title[0]}</div>}
      </a>
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
