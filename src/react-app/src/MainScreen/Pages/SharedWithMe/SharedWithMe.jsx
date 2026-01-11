import { useOutletContext } from 'react-router-dom';

import FilesGrid from "../../FilesGrid/FilesGrid.jsx"
import empty_folder from "../../../../assets/empty_folder_shared.svg"

import "../../FilesGrid/EmptyFolder.css"

function EmptyFolder() {
  return (
    <div className="empty-folder">
      <img src={empty_folder} />
      <p id="empty-folder-title">You have no shared items</p>
      <p id="empty-folder-text">Call a friend and ask them to share an item with you</p>
    </div>
  )
}

function SharedWithMe() {
  const { reload, setReload } = useOutletContext();
  return (
    <FilesGrid filter={["SHARES", "NOT TRASHED", "ALL LEVELS"]} emptyFolder={<EmptyFolder/>} title="Shared with me" reload={reload} setReload={setReload} />
  )
}

export default SharedWithMe
