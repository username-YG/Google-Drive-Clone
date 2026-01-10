import { useOutletContext } from 'react-router-dom';

import FilesGrid from "../../FilesGrid/FilesGrid.jsx"
import empty_folder from "../../../../assets/empty_folder_starred.svg"

import "../../FilesGrid/EmptyFolder.css"

function EmptyFolder() {
  return (
    <div className="empty-folder">
      <img src={empty_folder} />
      <p id="empty-folder-title">No starred files</p>
      <p id="empty-folder-text">Twinkle twinkle little star</p>
    </div>
  )
}

function Starred() {
  const { reload, setReload } = useOutletContext();
  return (
    <FilesGrid filter={["STARRED", "NOT TRASHED", "ALL LEVELS"]} emptyFolder={<EmptyFolder/>} title="Starred" reload={reload} setReload={setReload} />
  )
}

export default Starred
