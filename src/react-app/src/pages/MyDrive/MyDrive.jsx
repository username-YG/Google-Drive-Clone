import "./MyDrive.css"
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import docs from "../../../assets/docs.png"
import txt from "../../../assets/txt.png"
import notype from "../../../assets/notype.png"
import image from "../../../assets/image.png"
import pdf from "../../../assets/pdf.png"
import folder from "../../../assets/folder.png"
import dots from "../../../assets/dots.png"
import empty_folder from "../../../assets/empty_folder.svg"

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

function Folder({ file, selected, onSelect }) {
  
  const onFileClick = (e) => {
    e.stopPropagation();
    onSelect();
  }

  const navigate = useNavigate();
  return (
    <div className={`files-grid-item is-folder ${(selected === file.id) ? "selected" : ""}`}
      onClick={onFileClick} onDoubleClick={() => navigate("/folders/" + file.id)} >
      <div className="folder-item">
        <img src={folder} />
        <p>{file.name}</p>
        <img id="dots" src={dots} title="More actions" />
      </div>
    </div>
  )

}

function MyDrive() {

  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  const { folderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const updateData = async () => {

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
    updateData();
  }, [folderId]);

  const foldersObjects = items.filter(item => item.isFolder === true);
  const filesObjects = items.filter(item => item.isFolder === false);

  const folders = foldersObjects.map((item, i) =>
    <Folder key={i} file={item} selected={selected} onSelect={() => setSelected(item.id)} />
  );

  const files = filesObjects.map((item, i) =>
    <File key={i} file={item} selected={selected} onSelect={() => setSelected(item.id)} />
  );

  function EmptyFolder() {
    return (
      <div className="empty-folder">
        <img src={empty_folder} />
        <p id="empty-folder-title">This folder is empty and sad</p>
        <p id="empty-folder-text">Upload something so it won't be sad</p>
      </div>
    )
  }

  return (
    <div className="files-screen" onClick={() => setSelected(null)}>
      <p id="files-screen-title" onClick={() => navigate("/my-drive")}>My Drive</p>
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
