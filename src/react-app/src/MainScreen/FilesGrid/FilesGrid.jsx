import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import FilePreviewPopup from '../Popups/FilePreviewPopup/FilePreviewPopup.jsx';
import { trashItem, outsideClickListener, searchItems } from "../Popups/PopupLogic.js";

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

function PathTitle( {path, title} ) {

  const navigate = useNavigate();

  const onClickTitle = () => {
    navigate("/my-drive", {state: { path:[] } });
  }

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

async function getFiles(url, filter, navigate, withContent) {
  
  const token = localStorage.getItem("token")
  const response = await fetch("http://localhost:3000/api" + url, {
    'method': 'GET',
    'headers': {
      'Content-Type': 'application/json',
      'authorization': 'bearer ' + token,
      'filter': filter,
      "withcontent": withContent
    },
  });

  if (response.status == 200) {
    const data = await response.json();
    return data;
  }

  if (response.status == 404 || response.status == 403 || response.status == 401) {
    navigate("/login");
    return;
  }

}

const updateData = async (folderId, setItems, filter, navigate, query) => {

  const url = (folderId) ? ("/" + folderId) : ("");
  const data = (query) ? (await searchItems(query)) : (await getFiles("/files" + url, filter, navigate, "false"));
  if (!data) return;

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

  setItems(finalData)
}

function File({ file, selected, onSelect, reload, setReload, setSelectedFile, setIsPreviewOpen }) {

  const type = file.name.split('.').pop();
  const icon = icons[type] || icons["notype"];
  
  const openItem = () => {
    setSelectedFile(file);
    setIsPreviewOpen(true);
  };

  const onFileClick = (e) => {
    e.stopPropagation();
    onSelect();
  }

  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);
  outsideClickListener(isOpen, setIsOpen, popupRef)

  return (
    <div className={`files-grid-item is-file ${(selected === file.id) ? "selected" : ""}`}
      onClick={onFileClick} onDoubleClick={openItem} ref={popupRef} >
      <div className="files-header" >
        <img src={icon} />
        <p>{file.name}</p>
        <div className="actions-popup-div">
          <img id="dots" src={dots} title="More actions" onClick={() => setIsOpen(!isOpen)} />
          {isOpen && <ItemActionsPopup id={file.id} reload={reload} setReload={setReload} toggle={() => setIsOpen(false)} />}
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
    e.stopPropagation();
    onSelect();
  }

  const onFileDoubleClick = () => {
    const newPath = [...path, {id: file.id, name: file.name}];
    navigate("/folders/" + file.id, { state: { path: newPath } });
  }

  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);
  outsideClickListener(isOpen, setIsOpen, popupRef)

  const navigate = useNavigate();
  return (
    <div className={`files-grid-item is-folder ${(selected === file.id) ? "selected" : ""}`}
      onClick={onFileClick} onDoubleClick={onFileDoubleClick} ref={popupRef} >
      <div className="folder-item">
        <img src={folder} />
        <p>{file.name}</p>
        <div className="actions-popup-div">
          <img id="dots" src={dots} title="More actions"  onClick={() => setIsOpen(!isOpen)} />
          {isOpen && <ItemActionsPopup id={file.id} reload={reload} setReload={setReload} toggle={() => setIsOpen(false)} />}
        </div>
      </div>
    </div>
  )

}

function FilesGrid({ filter, emptyFolder, title, reload, setReload, query }) {

  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedPreviewFile, setSelectedPreviewFile] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { folderId } = useParams();
  const location = useLocation();
  const path = location.state?.path || [];

  const navigate = useNavigate();
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await updateData(folderId, setItems, filter, navigate, query);
      setLoading(false);
    }
    loadData();
  }, [folderId, reload, query]);

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
      {
      loading ? ( <div className="loader"></div> ) : (
      items.length === 0 ? ( emptyFolder ) : (
        <div>
          { folders.length > 0 &&  <div className="files-grid">{folders}</div> }
          <div className="files-grid">{files}</div>
        </div>
      ))}
      <FilePreviewPopup
          file={selectedPreviewFile}
          isOpen={isPreviewOpen}
          setIsOpen={setIsPreviewOpen}
      />
    </div>
  )
}

export default FilesGrid