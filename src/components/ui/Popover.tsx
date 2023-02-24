import { Link } from 'react-router-dom'
import React from 'react'
import '../../styles/Popover.css'

function CustomPopover({ links = null, setClose = null }) {
  return (
    <div className="popover">
      {links?.map(({ link, title }) => (
        <Link onClick={setClose} key={title} to={link}>
          {title}
        </Link>
      ))}
    </div>
  )
}

export default CustomPopover
