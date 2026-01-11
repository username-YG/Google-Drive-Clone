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

function SearchScreen() {
  const { reload, setReload } = useOutletContext();
  const [ params ] = useSearchParams();
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
