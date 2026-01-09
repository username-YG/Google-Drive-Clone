import "./SimpleMenuPopup.css"

export function SimpleMenuPopup({items}) {
  return (
    <ul className="item-menu">
      {items.map((item, i) => (
        <li key={i} className="item-menu-item" onClick={item.onClick}>{item.text}</li>
      ))}
    </ul>
  )
}