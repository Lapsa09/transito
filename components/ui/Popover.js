import Link from "next/link";
import React from "react";
import styles from "../../styles/Popover.module.css";

function CustomPopover({ links }) {
  return (
    <div className={styles.popover}>
      {links.map(({ link, title }, index) => (
        <Link key={index} href={link}>
          {title}
        </Link>
      ))}
    </div>
  );
}

export default CustomPopover;
