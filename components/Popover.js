import { Popover } from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";
import styles from "../styles/Popover.module.css";

function CustomPopover({ title, links }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <div className={styles.popover}>
      <a aria-describedby={id} onMouseEnter={handleClick}>
        {title}
      </a>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <div className={styles.links}>
          {links.map(({ link, title }) => (
            <Link href={link}>{title}</Link>
          ))}
        </div>
      </Popover>
    </div>
  );
}

export default CustomPopover;
