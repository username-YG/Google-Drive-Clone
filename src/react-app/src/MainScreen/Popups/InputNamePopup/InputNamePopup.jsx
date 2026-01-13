import { useState, useRef } from "react"
import { useOutsideClickListener } from "../PopupLogic.js"

import "./InputNamePopup.css"

// The popup where the user can input new text like when they rename or create a new folder
const InputNamePopup = ({ toggle, onDone, doneText, title, currentName, extended }) => {

  const [name, setName] = useState((currentName) ? (currentName) : ("Untitled folder"));
  const inputRef = useRef(null);
  const popupRef = useRef(null);
  useOutsideClickListener(true, toggle, popupRef);

  // CurrentName is the value the placeholder in the text box
  // Extended means the text box is big and allows easy edit for large texts (like file content)
  return (
    <div className="input-name-screen" >
      <div className="input-name-popup" onClick={(e) => e.stopPropagation()} onDoubleClick={(e) => e.stopPropagation()} ref={popupRef}>

        <h2 className="input-name-title">{title}</h2>
        
        {extended ? (
          <textarea ref={inputRef} className="input-name-input" value={name}
          onChange={(e) => setName(e.target.value)} />
        ) : (
          <input ref={inputRef} className="input-name-input" value={name}
          onChange={(e) => setName(e.target.value)} type="text" />
        )}
        
        <div className="input-name-buttons">
          <button onClick={toggle}>Cancel</button>
          <button onClick={async () => await onDone(name) }>{doneText}</button>
        </div>

      </div>
    </div>
  );
};

export default InputNamePopup