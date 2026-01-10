import { useOutletContext } from 'react-router-dom';

import FilesGrid from "../../FilesGrid/FilesGrid.jsx"
import empty_folder from "../../../../assets/empty_folder_trash.svg"

import "../../FilesGrid/EmptyFolder.css"

function EmptyFolder() {
  return (
    <div className="empty-folder">
      <img src={empty_folder} />
      <p id="empty-folder-title">Trash is empty</p>
      <p id="empty-folder-text">Press 'delete' key to remove</p>
    </div>
  )
}

function Trash() {
  const { reload, setReload } = useOutletContext();
  return (
    <FilesGrid filter={["TRASHED", "ALL LEVELS"]} emptyFolder={<EmptyFolder/>} title="Trash" reload={reload} setReload={setReload} />
  )
}

export default Trash
