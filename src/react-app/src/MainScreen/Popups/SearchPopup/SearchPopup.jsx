import "./SearchPopup.css"

import docs from "../../../../assets/docs.png"
import txt from "../../../../assets/txt.png"
import notype from "../../../../assets/notype.png"
import image from "../../../../assets/image.png"
import pdf from "../../../../assets/pdf.png"
import folder from "../../../../assets/folder.png"

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

// We suggest a few items to the user when they search something
// Clicking a suggestion opens it
function SearchPopup({ results, onFileClick }) {
  // Show first five found items
  return (
    <div>
      {results.slice(0,5).map((file) => (
        <li 
          key={file.id} 
          className="search-result-item"
          onClick={() => onFileClick(file)}
        > 
          <img className="search-result-icon" src={file.isFolder ? folder : icons[file.name.split('.').pop()] || icons["notype"]}/>
          <span className="search-result-name">
            {file.name}
          </span>
        </li>
      ))}
    </div>
  )
}

export default SearchPopup