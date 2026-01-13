import { useState, useEffect } from "react"
import { getAllFolders, moveItem } from "../PopupLogic.js"

import folder from "../../../../assets/folder.png"
import driveIcon from "../../../../assets/drive.png"

import "./MoveItemPopup.css"

const MoveItemPopup = ({ current, toggle, reload, setReload }) => {

  const [folders, setFolders] = useState([]);

  // Do you own this item
  const userId = sessionStorage.getItem("id");
  const doesOwn = (item) => {
    const permissions = item?.permissions || {};
    const role = permissions[userId];
    return (role === "owner");
  }

  // Update the list of folders available
  useEffect(() => {
    const updateFolders = async () => {
      const allFolders = await getAllFolders();
      setFolders(allFolders.filter(fold => 
        (fold.id !== current.id) && doesOwn(fold)
      )); // Exculed current and unowned item
    }
    updateFolders();
  }, [current]);

  const onMoveItem = async (newParentId) => {
    await moveItem(current.id, newParentId);
    toggle();
    if (setReload) setReload(!reload);
  }

  return (
    <div className="move-screen">
      <div className="move-popup" onClick={(e) => e.stopPropagation()} onDoubleClick={(e) => e.stopPropagation()}>
        <h2 className="move-title">Move "{current.name}"</h2>
        <ul className="move-list">
          
          { /* The root folder "My drive" always appears */ }
          <li className="move-list-item" onClick={() => onMoveItem(null)}>
             <img src={driveIcon} alt="Drive" />
             My Drive
          </li>

          { /* The list of folders we can move our item into */ }
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