import FilesGrid from "../../FilesGrid/FilesGrid.jsx"
import empty_folder from "../../../../assets/empty_folder.svg"

import "./MyDrive.css"

function EmptyFolder() {
  return (
    <div className="empty-folder">
      <img src={empty_folder} />
      <p id="empty-folder-title">This folder is empty and sad</p>
      <p id="empty-folder-text">Upload something so it won't be sad</p>
    </div>
  )
}

function filter() {
  ////////////////
}

function MyDrive() {
  return (
    <FilesGrid filter={filter} emptyFolder={<EmptyFolder/>} />
  )
}

export default MyDrive
