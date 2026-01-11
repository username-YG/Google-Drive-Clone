import { renameItem, trashItem, starItem, deleteItem, outsideClickListener } from "../PopupLogic.js";
import { useState , useRef } from 'react';

import people from "../../../../assets/people.png"
import star from "../../../../assets/star.png"
import folder from "../../../../assets/folder.png"
import trash from "../../../../assets/trash.png"
import pencil from "../../../../assets/pencil.png"
import InputNamePopup from "../InputNamePopup/InputNamePopup.jsx"
import MoveItemPopup from "../MoveItemPopup/MoveItemPopup.jsx"

import "./ItemActionsPopup.css"

function ItemActionsPopup( { file, reload, setReload, toggle } ) {

  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const popuRenamepRef = useRef(null);
  outsideClickListener(isRenameOpen, setIsRenameOpen, popuRenamepRef)

  const [isMovetoOpen, setIsMovetoOpen] = useState(false);
  const popuMovetoRef = useRef(null);
  outsideClickListener(isMovetoOpen, setIsMovetoOpen, popuMovetoRef)

  const onRenameItem = async (name) => {
    await renameItem(file.id, name);
    toggle();
    setIsRenameOpen(!isRenameOpen);
    setReload(!reload);
  };

  const url = window.location.href;
  const inTrash = url.includes("/trash");
  const inStarred = url.includes("/starred");

  const userId = localStorage.getItem("id");
  const permissions = file?.permissions || {};
  const role = permissions[userId];
  const canPatch = (role === "owner" || role === "writer");
  const canShare = (role === "owner");

  return (
    <ul className="item-actions-menu"
      ref={(element) => { popuRenamepRef.current = element; popuMovetoRef.current = element; }}>

      { !inTrash && (
        <li className={`item-actions-menu-item ${!canPatch ? "not-permitted" : ""}`} onClick={() => setIsRenameOpen(!isRenameOpen) } >
          <img src={pencil} />
          Rename
          {isRenameOpen && <InputNamePopup toggle={() => setIsRenameOpen(!isRenameOpen)} onDone={onRenameItem} doneText="Ok" />}
        </li>
      )}

      { !inTrash && <hr />}

      { !inTrash && (
        <li className={`item-actions-menu-item ${!canShare ? "not-permitted" : ""}`}>
          <img src={people} />
          Share
        </li>
      )}

      { !inTrash && (
        <li className={`item-actions-menu-item ${!canPatch ? "not-permitted" : ""}`} onClick={() => setIsMovetoOpen(!isMovetoOpen) } >
          <img src={folder} />
          Move to
          {isMovetoOpen && <MoveItemPopup toggle={() => setIsMovetoOpen(!isMovetoOpen)} id={file.id} reload={reload} setReload={setReload} />}
        </li>
      )}

      { !inTrash && <hr />}

      { !inTrash && !inStarred && (
        <li className="item-actions-menu-item" onClick={async() => { await starItem(file.id, true); toggle(); } }>
          <img src={star} />
          Star
        </li>
      )}

      { !inTrash && inStarred && (
        <li className="item-actions-menu-item" onClick={async() => { await starItem(file.id, false); toggle(); setReload(!reload); } }>
        <img src={star} />
          Remove from starred
        </li>
      )}

      { !inTrash && (
        <li className="item-actions-menu-item" onClick={async() => { await trashItem(file.id, true); toggle(); setReload(!reload); }} >
          <img src={trash} />
          Move to trash
        </li>
      )}

      { inTrash && (
        <li className="item-actions-menu-item" onClick={async() => { await trashItem(file.id, false); toggle(); setReload(!reload); }} >
          <img src={trash} />
          Restore
        </li>
      )}

      { inTrash && (
        <li className="item-actions-menu-item" onClick={async () => { await deleteItem(file.id); toggle(); setReload(!reload); }} >
          <img src={trash} />
          Delete forever
        </li>
      )}

    </ul>
  )
}

export default ItemActionsPopup