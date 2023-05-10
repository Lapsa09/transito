import React from 'react'
import PopupState, { bindMenu, bindHover } from 'material-ui-popup-state'
import HoverMenu from 'material-ui-popup-state/HoverMenu'
import { MenuItem, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { Links } from '../../types'

interface Props {
  links: Links[]
  name: string
}

function CustomPopover({ links, name }: Props) {
  return (
    <PopupState variant="popover" popupId={name}>
      {(popupState) => (
        <React.Fragment>
          <Typography sx={styles.navLink} {...bindHover(popupState)}>
            {name}
          </Typography>
          <HoverMenu {...bindMenu(popupState)}>
            {links.map((link) => (
              <MenuItem onClick={popupState.close} key={link.name}>
                <Link style={styles.subLink} to={link.link}>
                  {link.name}
                </Link>
              </MenuItem>
            ))}
          </HoverMenu>
        </React.Fragment>
      )}
    </PopupState>
  )
}

const styles = {
  navLink: {
    color: '#93af37',
    fontWeight: 700,
    fontSize: '1.5rem',
    cursor: 'pointer',
    '&:hover': {
      color: '#b7e912',
    },
  },
  subLink: {
    color: '#93af37',
    fontWeight: 700,
    fontSize: '1.5rem',
    cursor: 'pointer',
    '&:hover': {
      color: '#b7e912',
    },
    width: '150px',
    textDecoration: 'none',
  },
}

export default CustomPopover
