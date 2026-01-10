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

function SearchPopup({ results }) {
  return (
    <div>
      {results.slice(0,5).map((file) => (
        <li 
          key={file.id} 
          className="search-result-item"
          onClick={ () => {
            // navigating to the item

          }}
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