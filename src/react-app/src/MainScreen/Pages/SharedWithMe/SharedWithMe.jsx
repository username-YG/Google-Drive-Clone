import FilesGrid from "../../FilesGrid/FilesGrid.jsx"
import empty_folder from "../../../../assets/empty_folder_shared.svg"

import "../../FilesGrid/EmptyFolder.css"

function EmptyFolder() {
  return (
    <div className="empty-folder">
      <img src={empty_folder} />
      <p id="empty-folder-title">You have no shared folders</p>
      <p id="empty-folder-text">Call a friend and ask them to share a file with you</p>
    </div>
  )
}

function SharedWithMe() {
  return (
    <FilesGrid filter="SHARES" emptyFolder={<EmptyFolder/>} title="Shared with me" />
  )
}

export default SharedWithMe
