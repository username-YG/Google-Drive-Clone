import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { createFolder } from "../PopupLogic.js"

import "./InputNamePopup.css"

const InputNamePopup = ({ toggle, parentId, realod, setReload }) => {

  const [name, setName] = useState("Untitled folder");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const onCreateFolder = () => {
    createFolder(name, parentId);
    toggle();
    const url = window.location.href;
    if (!url.includes("/folders") && !url.includes("/my-drive")) navigate("/my-drive");
    setReload(!realod);
  };

  return (
    <div className="input-name-screen">
      <div className="input-name-popup" onClick={(e) => e.stopPropagation()}>

        <h2 className="input-name-title">New folder</h2>
        
        <input ref={inputRef} type="text" className="input-name-input" value={name}
          onChange={(e) => setName(e.target.value)}/>
        
        <div className="input-name-buttons">
          <button onClick={toggle}>Cancel</button>
          <button onClick={onCreateFolder}>Create</button>
        </div>

      </div>
    </div>
  );
};

export default InputNamePopup