import { useOutletContext } from 'react-router-dom';

import FilesGrid from "../../FilesGrid/FilesGrid.jsx"
import empty_folder from "../../../../assets/empty_folder_recent.svg"

import "../../FilesGrid/EmptyFolder.css"

function EmptyFolder() {
  return (
    <div className="empty-folder">
      <img src={empty_folder} />
      <p id="empty-folder-title">No recent files</p>
      <p id="empty-folder-text">"Time is relative" (Albert Einstein)</p>
    </div>
  )
}

/*
Recent screen shows:
- Owned or shared files recently accessed
- Doesn't show folders
- Shows files from all levels, not just root level
- Doesn't show files that are in trash
- Recently is defined as 'today' and accessed is defined as created \ patched
*/
function Recent() {
  const { reload, setReload } = useOutletContext();
  return (
    <FilesGrid
      filter={["NOT TRASHED", "ALL LEVELS", "NOT FOLDER", "RECENT"]}
      emptyFolder={<EmptyFolder/>}
      title="Recent"
      reload={reload}
      setReload={setReload}
    />
  )
}

export default Recent
