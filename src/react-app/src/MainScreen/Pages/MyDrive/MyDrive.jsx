import { useOutletContext } from 'react-router-dom';

import FilesGrid from "../../FilesGrid/FilesGrid.jsx"
import empty_folder from "../../../../assets/empty_folder_mydrive.svg"

import "../../FilesGrid/EmptyFolder.css"

function EmptyFolder() {
  return (
    <div className="empty-folder">
      <img src={empty_folder} />
      <p id="empty-folder-title">This folder is empty and sad</p>
      <p id="empty-folder-text">Upload something so it won't be sad</p>
    </div>
  )
}

function MyDrive() {
  const { reload, setReload } = useOutletContext();
  return (
    <FilesGrid filter={["OWNS", "NOT TRASHED"]} emptyFolder={<EmptyFolder/>} title="My Drive" reload={reload} setReload={setReload} />
  )
}

export default MyDrive
