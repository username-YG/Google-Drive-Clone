import { useState, useRef } from "react"

import "./InputNamePopup.css"

const InputNamePopup = ({ toggle, onDone, doneText, title, currentName }) => {

  const [name, setName] = useState((currentName) ? (currentName) : ("Untitled folder"));
  const inputRef = useRef(null);

  return (
    <div className="input-name-screen">
      <div className="input-name-popup" onClick={(e) => e.stopPropagation()}>

        <h2 className="input-name-title">{title}</h2>
        
        <input ref={inputRef} type="text" className="input-name-input" value={name}
          onChange={(e) => setName(e.target.value)}/>
        
        <div className="input-name-buttons">
          <button onClick={toggle}>Cancel</button>
          <button onClick={async () => await onDone(name) }>{doneText}</button>
        </div>

      </div>
    </div>
  );
};

export default InputNamePopup