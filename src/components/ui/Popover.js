import { Link } from 'react-router-dom';
import React from 'react';
import '../../styles/Popover.css';

function CustomPopover({ links }) {
  return (
    <div className="popover">
      {links.map(({ link, title }, index) => (
        <Link key={index} to={link}>
          {title}
        </Link>
      ))}
    </div>
  );
}

export default CustomPopover;
