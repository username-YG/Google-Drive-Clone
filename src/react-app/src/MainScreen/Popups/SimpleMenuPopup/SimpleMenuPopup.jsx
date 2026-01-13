import "./SimpleMenuPopup.css"

// Popup with a simple menu of clickable items
export function SimpleMenuPopup({items}) {
  return (
    <ul className="item-menu">
      {items.map((item, i) => (
        <li key={i} className="item-menu-item" onClick={item.onClick}>{item.text}</li>
      ))}
    </ul>
  )
}