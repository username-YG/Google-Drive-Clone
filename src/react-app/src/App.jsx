import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./App.css"

import Home from "./MainScreen/Pages/Home/Home.jsx";
import Login from "./Login/Login.jsx";
import Registration from "./Registration/Registration.jsx";
import MyDrive from "./MainScreen/Pages/MyDrive/MyDrive.jsx";
import Recent from "./MainScreen/Pages/Recent/Recent.jsx";
import SharedWithMe from "./MainScreen/Pages/SharedWithMe/SharedWithMe.jsx";
import Starred from "./MainScreen/Pages/Starred/Starred.jsx";
import Trash from "./MainScreen/Pages/Trash/Trash.jsx";
import Settings from "./MainScreen/Pages/Settings/Settings.jsx";
import MainScreen from "./MainScreen/MainScreen.jsx"
import SearchScreen from "./MainScreen/Pages/SearchScreen/SearchScreen.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route>

          <Route path="login" element={<Login />} />
          <Route path="register" element={<Registration />} />
          <Route path="settings" element={<Settings />} />

          <Route element={<MainScreen/>}>

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
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
