import "./MyDrive.css"
import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

import docs from "../../../assets/docs.png"
import txt from "../../../assets/txt.png"
import notype from "../../../assets/notype.png"
import image from "../../../assets/image.png"
import pdf from "../../../assets/pdf.png"
import folder from "../../../assets/folder.png"
import dots from "../../../assets/dots.png"
import empty_folder from "../../../assets/empty_folder.svg"
import right_arrow from "../../../assets/right_arrow.png"

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

async function getFiles(url) {
  const response = await fetch("http://localhost:3000/api" + url, {
    'method': 'GET',
    'headers': {
      'Content-Type': 'application/json',
      'authorization': 'bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRvbUBnbWFpbC5jb20iLCJJRCI6ImI2MmUxZDcwLTc2NjEtNGZlYy1iYjk2LTAxNTYxN2MwNTdiMyIsImlhdCI6MTc2Nzc3ODY3N30.Wy8xTJm_y5wjV2qjKIuaZ1W58hyKsvwlJWaUXh1cvP8"
    },
  });
  if (response.status == 200) {
    const data = await response.json();
    return data;
  }
}

function File({ file, selected, onSelect }) {

  const type = file.name.split('.').pop();
  const icon = icons[type] || icons["notype"];
  
  const openItem = () => {
    alert(file.content);
  };

  const onFileClick = (e) => {
    e.stopPropagation();
    onSelect();
  }

  return (
    <div className={`files-grid-item is-file ${(selected === file.id) ? "selected" : ""}`}
      onClick={onFileClick} onDoubleClick={openItem} >
      <div className="files-header">
        <img src={icon} />
        <p>{file.name}</p>
        <img id="dots" src={dots} title="More actions" />
      </div>
      <div className="files-preview">
        <img src={icon} />
      </div>
    </div>
  )
}

function Folder({ file, selected, onSelect, path }) {
  
  const onFileClick = (e) => {
    e.stopPropagation();
    onSelect();
  }

  const onFileDoubleClick = () => {
    const newPath = [...path, {id: file.id, name: file.name}];
    navigate("/folders/" + file.id, { state: { path: newPath } });
  }

  const navigate = useNavigate();
  return (
    <div className={`files-grid-item is-folder ${(selected === file.id) ? "selected" : ""}`}
      onClick={onFileClick} onDoubleClick={onFileDoubleClick} >
      <div className="folder-item">
        <img src={folder} />
        <p>{file.name}</p>
        <img id="dots" src={dots} title="More actions" />
      </div>
    </div>
  )

}

function EmptyFolder() {
  return (
    <div className="empty-folder">
      <img src={empty_folder} />
      <p id="empty-folder-title">This folder is empty and sad</p>
      <p id="empty-folder-text">Upload something so it won't be sad</p>
    </div>
  )
}

const updateData = async (folderId, setItems) => {

  const url = (folderId) ? ("/" + folderId) : ("");
  const data = await getFiles("/files" + url);
  if (!data) return;

  if (folderId) {
    for (let i = 0; i < data.content.length; i++) {
      const item = await getFiles("/files/" + data.content[i]);
      if (item) data.content[i] = item;
    }
    setItems(data.content);
  } else {
    setItems(data)
  }

}

function PathTitle({path}) {

  const navigate = useNavigate();

  const onClickDrive = () => {
    navigate("/my-drive", {state: { path:[] } });
  }

  const onClickFolder = (folder, i) => {
    navigate("/folders/" + folder.id, { state: { path: path.slice(0, i + 1) } })
  }

  return (
    <div className="path-bar">
      <p className="files-screen-title" onClick={onClickDrive} title="My Drive">My Drive</p>
      {path.map((folder, i) => (
        <div key={i}>
          <img src={right_arrow} />
          <p className="files-screen-title" onClick={() => onClickFolder(folder, i)}>{folder.name}</p>
        </div>
      ))}
    </div>
  );
}

function MyDrive() {

  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  const { folderId } = useParams();
  const location = useLocation();
  const path = location.state?.path || [];

  useEffect(() => {
    updateData(folderId, setItems);
  }, [folderId]);

  const foldersObjects = items.filter(item => item.isFolder === true);
  const filesObjects = items.filter(item => item.isFolder === false);

  const folders = foldersObjects.map((item, i) =>
    <Folder key={i} file={item} selected={selected} onSelect={() => setSelected(item.id)} path={path} />
  );

  const files = filesObjects.map((item, i) =>
    <File key={i} file={item} selected={selected} onSelect={() => setSelected(item.id)} />
  );

  return (
    <div className="files-screen" onClick={() => setSelected(null)}>
      <PathTitle path={path}/>
      {items.length === 0 ? (
        <EmptyFolder/>
      ) : (
        <div>
          <div className="files-grid">{folders}</div>
          <div className="files-grid">{files}</div>
        </div>
      )}
    </div>
  )
}

export default MyDrive
