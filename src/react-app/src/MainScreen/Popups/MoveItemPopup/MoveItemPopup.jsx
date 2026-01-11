import { useState, useEffect } from "react"
import { getAllFolders, moveItem } from "../PopupLogic.js"

import folder from "../../../../assets/folder.png"
import driveIcon from "../../../../assets/drive.png"

import "./MoveItemPopup.css"

const MoveItemPopup = ({ id, toggle, reload, setReload }) => {

  const [folders, setFolders] = useState([]);

  useEffect(() => {
    const updateFolders = async () => {
      const allFolders = await getAllFolders();
      setFolders(allFolders.filter(fold => fold.id !== id));
    }
    updateFolders();
  }, [id]);

  const onMoveItem = async (newParentId) => {
    await moveItem(id, newParentId);
    toggle();
    setReload(!reload);
  }

  return (
    <div className="move-screen">
      <div className="move-popup" onClick={(e) => e.stopPropagation()}>
        <h2 className="move-title">Move item</h2>
        <ul className="move-list">
            
          <li className="move-list-item" onClick={() => onMoveItem(null)}>
             <img src={driveIcon} alt="Drive" />
             My Drive
          </li>

          {folders.map((fold) => (
            <li key={fold.id} className="move-list-item" onClick={() => onMoveItem(fold.id)}>
              <img src={folder} />
              {fold.name}
            </li>
          ))}

        </ul>

        <div className="move-buttons">
            <button onClick={toggle}>Cancel</button>
        </div>
        
      </div>
    </div>
  );
};

export default MoveItemPopup