import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

import docs from "../../../assets/docs.png"
import txt from "../../../assets/txt.png"
import notype from "../../../assets/notype.png"
import image from "../../../assets/image.png"
import pdf from "../../../assets/pdf.png"
import folder from "../../../assets/folder.png"
import dots from "../../../assets/dots.png"
import right_arrow from "../../../assets/right_arrow.png"

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

async function getFiles(url, filter) {
  
  const token = localStorage.getItem("token")
  const response = await fetch("http://localhost:3000/api" + url, {
    'method': 'GET',
    'headers': {
      'Content-Type': 'application/json',
      'authorization': 'bearer ' + token,
      'filter': filter
    },
  });

  if (response.status == 200) {
    const data = await response.json();
    return data;
  }
}

const updateData = async (folderId, setItems, filter) => {

  const url = (folderId) ? ("/" + folderId) : ("");
  const data = await getFiles("/files" + url, filter);
  if (!data) return;

  let finalData;
  if (folderId) {
    finalData = await Promise.all(
      data.content.map(async (id) => {
        const item = await getFiles("/files/" + id, filter);
        return item || id;
      })
    );
  } else {
    finalData = data;
  }

  setItems(finalData)
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

function FilesGrid({ filter, emptyFolder, title }) {

  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  const { folderId } = useParams();
  const location = useLocation();
  const path = location.state?.path || [];

  useEffect(() => {
    updateData(folderId, setItems, filter);
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
    <div className="files-grid-screen" onClick={() => setSelected(null)}>
      <PathTitle path={path} title={title}/>
      {items.length === 0 ? (
        emptyFolder
      ) : (
        <div>
          <div className="files-grid">{folders}</div>
          <div className="files-grid">{files}</div>
        </div>
      )}
    </div>
  )
}

export default FilesGrid