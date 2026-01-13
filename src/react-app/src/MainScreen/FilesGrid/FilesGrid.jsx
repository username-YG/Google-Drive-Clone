import {useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import FilePreviewPopup from '../Popups/FilePreviewPopup/FilePreviewPopup.jsx';
import {useOutsideClickListener, searchItems, trashItem} from "../Popups/PopupLogic.js";

import docs from "../../../assets/docs.png"
import txt from "../../../assets/txt.png"
import notype from "../../../assets/notype.png"
import image from "../../../assets/image.png"
import pdf from "../../../assets/pdf.png"
import folder from "../../../assets/folder.png"
import dots from "../../../assets/dots.png"
import right_arrow from "../../../assets/right_arrow.png"
import ItemActionsPopup from "../Popups/ItemActionsPopup/ItemActionsPopup.jsx"

import "./FilesGrid.css"

const icons = {
  "txt": txt,
  "docs": docs,
  "docx": docs,
  "notype": notype,
  "jpg": image,
  "jpeg": image,
  "png": image,
  "pdf": pdf
}

// The path of folders you are in
function PathTitle( {path, title} ) {

  const navigate = useNavigate();

  // Clicking the first moves us to my drive
  const onClickTitle = () => {
    navigate("/my-drive", {state: { path:[] } });
  }

  // Clicking a folder moves us to it, we track well using navigation states
  const onClickFolder = (folder, i) => {
    navigate("/folders/" + folder.id, { state: { path: path.slice(0, i + 1) } })
  }

  return (
    <div className="path-bar">
      <p className="files-grid-screen-title" onClick={onClickTitle} >{title}</p>
      {path.map((folder, i) => (
        <div key={i}>
          <img src={right_arrow} />
          <p className="files-grid-screen-title" onClick={() => onClickFolder(folder, i)}>{folder.name}</p>
        </div>
      ))}
    </div>
  );
}

// Gets the all files and folders from the server
async function getFiles(url, filter, navigate, withContent) {
  
  const token = sessionStorage.getItem("token")
  const port = import.meta.env.VITE_WEB_PORT || 3000;
  const response = await fetch(`http://localhost:${port}/api${url}`, {
    'method': 'GET',
    'headers': {
      'Content-Type': 'application/json',
      'authorization': 'bearer ' + token,
      'filter': filter,
      "withcontent": withContent
    },
  });

  if (response.status === 200) {
    return await response.json();
  }

  // If the user's token doesn't exist or invalid, we send to login
  if (response.status === 404 || response.status === 403 || response.status === 401) {
    navigate("/login");
  }

}

// Update the grid of files and folders
const updateData = async (folderId, setItems, filter, navigate, query) => {

  // The url contains the current folder and a query to filter by
  const url = (folderId) ? ("/" + folderId) : ("");
  let data = (query) ? (await searchItems(query)) : (await getFiles("/files" + url, filter, navigate, "false"));
  if (!data) return;

  // Manually filter trashed because search doesn't
  if (query && filter && filter.includes("NOT TRASHED")) {
    data = data.filter(item => !item.trashed);
  }

  // Folders return list of item ids inside them, we convert each id to its object
  let finalData;
  if (folderId) {
    finalData = await Promise.all(
      data.content.map(async (id) => {
        const item = await getFiles("/files/" + id, filter, navigate, "false");
        if (item) { item.id = id; }
        return item || id;
      })
    );
  } else {
    finalData = data;
  }

  // Update the grid with the new data
  // By fetching metdata only, without content, we make this function very fast
  finalData.sort((a, b) => b.timestamp - a.timestamp); // sort by timestamp decreasing
  setItems(finalData)
}

function File({ file, selected, onSelect, reload, setReload, setSelectedFile, setIsPreviewOpen }) {

  // The type determines the file's icon
  const type = file.name.split('.').pop();
  const icon = icons[type] || icons["notype"];
  
  // Double clicking a file displays it
  const openItem = () => {
    setSelectedFile(file);
    setIsPreviewOpen(true);
  };

  const onFileClick = (e) => {
    e.stopPropagation(); // We don't want sub-components to handle the event too
    onSelect();
  }

  // Three dots open action menu
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);
  useOutsideClickListener(isOpen, setIsOpen, popupRef)

  return (
    <div className={`files-grid-item is-file ${(selected === file.id) ? "selected" : ""}`}
      onClick={onFileClick} onDoubleClick={openItem} ref={popupRef} >
      <div className="files-header" >
        <img src={icon} />
        <p>{file.name}</p>
        <div className="actions-popup-div">
          <img id="dots" src={dots} title="More actions" onClick={() => setIsOpen(!isOpen)} />
          {isOpen && <ItemActionsPopup origFile={file} reload={reload} setReload={setReload} toggle={() => setIsOpen(false)} />}
        </div>
      </div>
      <div className="files-preview">
        <img src={icon} />
      </div>
    </div>
  )
}

function Folder({ file, selected, onSelect, path, reload, setReload }) {
  
  const onFileClick = (e) => {
    e.stopPropagation();  // We don't want sub-components to handle the event too
    onSelect();
  }

  // Double clicking a file moves us into it (we update nav state for the path)
  const onFileDoubleClick = () => {
    const newPath = [...path, {id: file.id, name: file.name}];
    navigate("/folders/" + file.id, { state: { path: newPath } });
  }

  // Three dots open action menu
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);
  useOutsideClickListener(isOpen, setIsOpen, popupRef)

  const navigate = useNavigate();
  return (
    <div className={`files-grid-item is-folder ${(selected === file.id) ? "selected" : ""}`}
      onClick={onFileClick} onDoubleClick={onFileDoubleClick} ref={popupRef} >
      <div className="folder-item">
        <img src={folder} />
        <p>{file.name}</p>
        <div className="actions-popup-div">
          <img id="dots" src={dots} title="More actions"  onClick={() => setIsOpen(!isOpen)} />
          {isOpen && <ItemActionsPopup origFile={file} reload={reload} setReload={setReload} toggle={() => setIsOpen(false)} />}
        </div>
      </div>
    </div>
  )

}

function FilesGrid({ filter, emptyFolder, title, reload, setReload, query }) {

  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null); // Track currently selected item
  const [selectedPreviewFile, setSelectedPreviewFile] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { folderId } = useParams();
  const location = useLocation();
  const path = location.state?.path || [];

  const refreshFiles = () => {
    void updateData(folderId, setItems, filter);
  };

  const navigate = useNavigate();
  useEffect(() => {
    const loadData = async () => {
      setLoading(true); // Show loading screen
      await updateData(folderId, setItems, filter, navigate, query);
      setLoading(false); // Hide loading screen
    }
    loadData();
  }, [folderId, reload, query]);

  // Pressing 'delete'should trash selected item
  useEffect(() => {
    const handleKeyDown = async (event) => {
      if (event.key === "Delete" && selected !== null) {
        await trashItem(selected, true);
        setReload(!reload)
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => { document.removeEventListener("keydown", handleKeyDown); };
  }, [selected]);

  // We seperate the files and folders on the screen
  const foldersObjects = items.filter(item => item.isFolder === true);
  const filesObjects = items.filter(item => item.isFolder === false);

  const folders = foldersObjects.map((item, i) =>
    <Folder
      key={i}
      file={item}
      selected={selected}
      onSelect={() => setSelected(item.id)}
      path={path}
      reload={reload}
      setReload={setReload}
    />
  );

  const files = filesObjects.map((item, i) =>
    <File
      key={i}
      file={item}
      selected={selected}
      onSelect={() => setSelected(item.id)}
      setSelectedFile={setSelectedPreviewFile}
      setIsPreviewOpen={setIsPreviewOpen}
      reload={reload}
      setReload={setReload}
    />
  );

  return (
    <div className="files-grid-screen" onClick={() => setSelected(null)}>

      <PathTitle path={path} title={title}/>

      { /* If we are loading, only show loading screen */ }
      { /* Show emptyFolder screen when there is nothing to display */ }

      { loading ? ( <div className="loader"></div> ) : ( (items.length === 0) ? ( emptyFolder ) : (

        <div>
          { /* Don't show folders grid if it is empty */ }
          { folders.length > 0 &&  <div className="files-grid">{folders}</div> }
          <div className="files-grid">{files}</div>
        </div>

      ))}

      <FilePreviewPopup
          file={selectedPreviewFile}
          isOpen={isPreviewOpen}
          setIsOpen={setIsPreviewOpen}
          onActionComplete={refreshFiles}
      />
    </div>

  )
}

export default FilesGrid