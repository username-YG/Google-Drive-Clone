import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Login/Login.jsx";
import Registration from "./pages/Registration/Registration.jsx";
import MyDrive from "./pages/MyDrive/MyDrive.jsx";
import Recent from "./pages/Recent/Recent.jsx";
import SharedWithMe from "./pages/SharedWithMe/SharedWithMe.jsx";
import Starred from "./pages/Starred/Starred.jsx";
import Trash from "./pages/Trash/Trash.jsx";

import SidePanel from "./SidePanel/SidePanel.jsx"
import TopBar from "./TopBar/TopBar.jsx"

function MainScreen() {
  return (
    <div>
      <SidePanel />
      <TopBar />
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route>

          <Route path="login" element={<Login />} />
          <Route path="register" element={<Registration />} />
          
          <Route element={<MainScreen/>}>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="home" element={<Home />} />
            <Route path="my-drive" element={<MyDrive />} />
            <Route path="recent" element={<Recent />} />
            <Route path="shared-with-me" element={<SharedWithMe />} />
            <Route path="starred" element={<Starred />} />
            <Route path="trash" element={<Trash />} />
          </Route>
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
