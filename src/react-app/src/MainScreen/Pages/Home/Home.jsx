import { useOutletContext } from 'react-router-dom';

import FilesGrid from "../../FilesGrid/FilesGrid.jsx"
import empty_folder from "../../../../assets/empty_folder_home.svg"

import "../../FilesGrid/EmptyFolder.css"

function EmptyFolder() {
  return (
    <div className="empty-folder">
      <img src={empty_folder} />
      <p id="empty-folder-title">Welcome to google drive!</p>
      <p id="empty-folder-text">This screen shows all your personal and shared files</p>
    </div>
  )
}

/*
The home screen shows:
- Files and folders owned by me
- Files and folders shared with me
- Files from all levels, not just root
- Doesn't show items that are in trash 
*/
function Home() {
  const { reload, setReload } = useOutletContext();
  return (
    <FilesGrid
      filter={["NOT TRASHED", "ALL LEVELS"]}
      emptyFolder={<EmptyFolder/>}
      title="Welcome"
      reload={reload}
      setReload={setReload}
    />
  )
}

export default Home
