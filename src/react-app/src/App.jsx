import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css"

import Home from "./MainScreen/Pages/Home/Home.jsx";
import Login from "./Login/Login.jsx";
import Registration from "./Registration/Registration.jsx";
import MyDrive from "./MainScreen/Pages/MyDrive/MyDrive.jsx";
import Recent from "./MainScreen/Pages/Recent/Recent.jsx";
import SharedWithMe from "./MainScreen/Pages/SharedWithMe/SharedWithMe.jsx";
import Starred from "./MainScreen/Pages/Starred/Starred.jsx";
import Trash from "./MainScreen/Pages/Trash/Trash.jsx";
import MainScreen from "./MainScreen/MainScreen.jsx"
import SearchScreen from "./MainScreen/Pages/SearchScreen/SearchScreen.jsx";

function NotFoundScreen() {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>404 - Page Not Found</h2>
      <p>Try "/home"</p>
    </div>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  useEffect(() => {
    if (darkMode) {
      document.body.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  return (
    <BrowserRouter>
      <Routes>
        <Route>

          <Route path="login" element={<Login />} />
          <Route path="register" element={<Registration />} />

          <Route element={<MainScreen toggleDarkMode={toggleDarkMode} darkMode={darkMode}/>}>

            <Route path="/" element={<Navigate to="/home" replace />} />

            <Route path="my-drive" element={<MyDrive />} />
            <Route path="folders/" element={<Navigate to="/my-drive" replace />} />
            <Route path="folders/:folderId" element={<MyDrive />} />

            <Route path="home" element={<Home />} />
            <Route path="recent" element={<Recent />} />
            <Route path="shared-with-me" element={<SharedWithMe />} />
            <Route path="starred" element={<Starred />} />
            <Route path="trash" element={<Trash />} />

            <Route path="search" element={<SearchScreen />} />

          </Route>
        </Route>

        <Route path="*" element={<NotFoundScreen />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
