import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom"

import SidePanel from "./SidePanel/SidePanel.jsx"
import TopBar from "./TopBar/TopBar.jsx"

import "./MainScreen.css"

function MainScreen() {

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
  }

  return (
    <div className="main-screen">
      <SidePanel />
      <TopBar />
      <Outlet />
    </div>
  );
}

export default MainScreen