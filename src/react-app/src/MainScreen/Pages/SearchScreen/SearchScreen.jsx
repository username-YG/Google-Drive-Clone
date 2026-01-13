import { useOutletContext, useSearchParams } from 'react-router-dom';

import FilesGrid from "../../FilesGrid/FilesGrid.jsx"
import empty_folder from "../../../../assets/empty_folder_search.svg"

import "../../FilesGrid/EmptyFolder.css"

function EmptyFolder() {
  return (
    <div className="empty-folder">
      <img src={empty_folder} />
      <p id="empty-folder-title">None of your files or folders matched this search</p>
      <p id="empty-folder-text"></p>
    </div>
  )
}

/*
Search screen shows:
- Files that contain the query in name \ content
- Folders that contains the query in name
- Shows both shared and owned items
- Shows items from all levels, not just root
- Doesn't show items that are in trash
*/
function SearchScreen() {
  const { reload, setReload } = useOutletContext();
  const [ params ] = useSearchParams(); // We extract the query from the url
  return (
    <FilesGrid
        filter={["ALL LEVELS", "NOT TRASHED"]}
        emptyFolder={<EmptyFolder/>}
        title="Search results"
        reload={reload}
        setReload={setReload}
        query={params.get('q')}
    />
  )
}

export default SearchScreen
