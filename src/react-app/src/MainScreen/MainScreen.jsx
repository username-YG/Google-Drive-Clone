import { useState } from "react"
import { Outlet } from "react-router-dom";

import SidePanel from "./SidePanel/SidePanel.jsx"
import TopBar from "./TopBar/TopBar.jsx"

import "./MainScreen.css"

function MainScreen({ toggleDarkMode, darkMode }) {

  // Allows sub-components of SidePanel to reload main screen 
  const [reload, setReload] = useState(false)

  return (
    <div className="main-screen">
      <SidePanel reload={reload} setReload={setReload} />
        <TopBar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        <Outlet context={{ reload, setReload }} />
    </div>
  );
}

export default MainScreen