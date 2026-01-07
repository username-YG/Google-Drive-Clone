import "./MyDrive.css"
import { useState, useEffect, useRef } from 'react';

import docs from "../../../assets/docs.png"
import txt from "../../../assets/txt.png"
import notype from "../../../assets/notype.png"
import image from "../../../assets/image.png"
import pdf from "../../../assets/pdf.png"
import folder from "../../../assets/folder.png"
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
      </div>
      <div className="files-preview">
        <img src={icon} />
      </div>
    </div>
  )
}

function Folder({ file, selected, onSelect, setItems }) {
  
  const openItem = async () => {
    let data = await getFiles("/files/" + file.id);
    if (data) {
      data = data.content;
      for (let i = 0; i < data.length; i++) {
        const item = await getFiles("/files/" + data[i]);
        if (item) data[i] = item;
      }
      setItems(data);
    }
  };

  const onFileClick = (e) => {
    e.stopPropagation();
    onSelect();
  }

  return (
    <div className={`files-grid-item is-folder ${(selected === file.id) ? "selected" : ""}`}
      onClick={onFileClick} onDoubleClick={openItem} >
      <div className="folder-item">
        <img src={folder} />
        <p>{file.name}</p>
      </div>
    </div>
  )

}

function MyDrive() {

  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const updateData = async () => {
      const data = await getFiles("/files");
      if (data) setItems(data);
    }
    updateData();
  }, []);

  const foldersObjects = items.filter(item => item.isFolder === true);
  const filesObjects = items.filter(item => item.isFolder === false);

  const folders = foldersObjects.map((item, i) =>
    <Folder key={i} file={item} selected={selected} onSelect={() => setSelected(item.id)} setItems={setItems} />
  );

  const files = filesObjects.map((item, i) =>
    <File key={i} file={item} selected={selected} onSelect={() => setSelected(item.id)} />
  );

  function EmptyFolder() {
    return (
      <div class="empty-folder">
        <img src={empty_folder} />
        <p id="empty-folder-title">This folder is empty and sad</p>
        <p id="empty-folder-text">Upload something so it won't be sad</p>
      </div>
    )
  }

  return (
    <div className="files-screen" onClick={() => setSelected(null)}>
      <p id="files-screen-title">My Drive</p>
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
