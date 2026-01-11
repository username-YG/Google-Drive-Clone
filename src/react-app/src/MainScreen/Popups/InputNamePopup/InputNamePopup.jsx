import { useState, useRef } from "react"

import "./InputNamePopup.css"

const InputNamePopup = ({ toggle, onDone, doneText }) => {

  const [name, setName] = useState("Untitled folder");
  const inputRef = useRef(null);

  return (
    <div className="input-name-screen">
      <div className="input-name-popup" onClick={(e) => e.stopPropagation()}>

        <h2 className="input-name-title">New folder</h2>
        
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