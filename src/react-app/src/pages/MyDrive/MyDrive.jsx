import "./MyDrive.css"
import { useState, useEffect, useRef } from 'react';

import docs from "../../../assets/docs.png"
import txt from "../../../assets/txt.png"
import notype from "../../../assets/notype.png"
import image from "../../../assets/image.png"
import pdf from "../../../assets/pdf.png"

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

function File({ file, selectedFile, onSelect }) {

  const type = file.name.split('.').pop();
  const icon = icons[type] || icons["notype"];
  
  const openItem = () => {
    alert(file.content)
  };

  const onFileClick = (e) => {
    e.stopPropagation();
    onSelect();
  }

  return (
    <div className={`files-grid-item ${(selectedFile === file.id) ? "selected" : ""}`}
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

function MyDrive() {

  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const listItems = files.map((file) =>
    <File file={file} selectedFile={selectedFile} onSelect={() => setSelectedFile(file.id)} />
  );

  useEffect(() => {
    async function getFiles() {
      const response = await fetch('http://localhost:3000/api/files', {
        'method': 'get',
        'headers': {
          'Content-Type': 'application/json',
          'authorization': 'bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRvbUBnbWFpbC5jb20iLCJJRCI6ImI2MmUxZDcwLTc2NjEtNGZlYy1iYjk2LTAxNTYxN2MwNTdiMyIsImlhdCI6MTc2Nzc3ODY3N30.Wy8xTJm_y5wjV2qjKIuaZ1W58hyKsvwlJWaUXh1cvP8"
        },
      });
      if (response.status == 200) {
        const data = await response.json();
        setFiles(data);
      }
    }
    getFiles();
  }, []);

  return (
    <div className="files-screen" onClick={() => setSelectedFile(null)}>
      <p id="files-screen-title">My Drive</p>
      <div className="files-grid"> {listItems} </div>
    </div>
  )
}

export default MyDrive
