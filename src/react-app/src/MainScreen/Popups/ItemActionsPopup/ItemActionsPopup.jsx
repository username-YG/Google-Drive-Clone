import { renameItem, trashItem, starItem, deleteItem, outsideClickListener } from "../PopupLogic.js";
import { useState , useRef } from 'react';

import people from "../../../../assets/people.png"
import star from "../../../../assets/star.png"
import folder from "../../../../assets/folder.png"
import trash from "../../../../assets/trash.png"
import pencil from "../../../../assets/pencil.png"
import InputNamePopup from "../InputNamePopup/InputNamePopup.jsx"

import "./ItemActionsPopup.css"

function ItemActionsPopup( { id, reload, setReload, toggle } ) {

  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);
  outsideClickListener(isOpen, setIsOpen, popupRef)

  const onRenameItem = async (name) => {
    await renameItem(id, name);
    toggle();
    setIsOpen(!isOpen);
    setReload(!reload);
  };

  const url = window.location.href;
  const inTrash = url.includes("/trash");
  const inStarred = url.includes("/starred");

  return (
    <ul className="item-actions-menu" ref={popupRef}>

      { !inTrash && (
        <li className="item-actions-menu-item" onClick={() => setIsOpen(!isOpen) } >
          <img src={pencil} />
          Rename
          {isOpen && <InputNamePopup toggle={() => setIsOpen(!isOpen)} onDone={onRenameItem} doneText="Ok" />}
        </li>
      )}

      { !inTrash && <hr />}

      { !inTrash && (
        <li className="item-actions-menu-item">
          <img src={people} />
          Share
        </li>
      )}

      { !inTrash && (
        <li className="item-actions-menu-item">
          <img src={folder} />
          Move to
        </li>
      )}

      { !inTrash && <hr />}

      { !inTrash && !inStarred && (
        <li className="item-actions-menu-item" onClick={async() => { await starItem(id, true); toggle(); } }>
          <img src={star} />
          Star
        </li>
      )}

      { !inTrash && inStarred && (
        <li className="item-actions-menu-item" onClick={async() => { await starItem(id, false); toggle(); setReload(!reload); } }>
        <img src={star} />
          Remove from starred
        </li>
      )}

      { !inTrash && (
        <li className="item-actions-menu-item" onClick={async() => { await trashItem(id, true); toggle(); setReload(!reload); }} >
          <img src={trash} />
          Move to trash
        </li>
      )}

      { inTrash && (
        <li className="item-actions-menu-item" onClick={async() => { await trashItem(id, false); toggle(); setReload(!reload); }} >
          <img src={trash} />
          Restore
        </li>
      )}

      { inTrash && (
        <li className="item-actions-menu-item" onClick={async () => { await deleteItem(id); toggle(); setReload(!reload); }} >
          <img src={trash} />
          Delete forever
        </li>
      )}

    </ul>
  )
}
export default ItemActionsPopup