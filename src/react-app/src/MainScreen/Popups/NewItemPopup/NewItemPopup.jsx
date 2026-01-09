import { useState, useRef } from 'react';
import { useParams } from "react-router-dom";
import { outsideClickListener } from "../PopupLogic.js"
import { createFolder } from "../PopupLogic.js";

import folderplus from "../../../../assets/folderplus.png"
import fileup from "../../../../assets/fileup.png"
import folderup from "../../../../assets/folderup.png"
import InputNamePopup from "../InputNamePopup/InputNamePopup.jsx"

import "./NewItemPopup.css"

function NewItemPopup( { reload, setReload } ) {

  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);
  outsideClickListener(isOpen, setIsOpen, popupRef)
  const { folderId } = useParams();

  const onCreateFolder = (name) => {
    createFolder(name, folderId);
    setIsOpen(!isOpen)
    const url = window.location.href;
    if (!url.includes("/folders") && !url.includes("/my-drive")) navigate("/my-drive");
    setReload(!reload);
  };

  return (
    <ul className="new-item-menu" ref={popupRef}>

      <li className="new-item-menu-item" onClick={() => setIsOpen(!isOpen)}>
        <img src={folderplus}/>
        New folder
        {isOpen && <InputNamePopup toggle={() => setIsOpen(!isOpen)} onDone={onCreateFolder} doneText="Create" />}
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

export default NewItemPopup