import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { authActions } from '../../redux/userSlice'
import CustomPopover from './Popover'
import styles from '../../styles/Home.module.css'
import {
  Logout,
  Menu as MenuIcon,
  ExpandMore,
  ChevronRight,
} from '@mui/icons-material'
import { Link } from 'react-router-dom'
import {
  Box,
  IconButton,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Collapse,
} from '@mui/material'
import { IRootState } from '../../redux'
import { Links, User } from '../../types'
import { sxStyles } from '../../utils'

interface CustomDrawerProps {
  pages: Links[]
}

function CustomDrawer({ pages }: CustomDrawerProps) {
  const user = useSelector<IRootState, User>((x) => x.user.user)
  const [anchorElNav, setAnchorElNav] = useState(null)
  const [dropdown, setDropdown] = useState(null)

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
    setDropdown(null)
  }

  const onTouchStart = (_menu) => {
    setDropdown(dropdown === _menu ? null : _menu)
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }

  return (
    <>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleOpenNavMenu}
        color="inherit"
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        open={Boolean(anchorElNav)}
        sx={style.smallDrawer}
        onClose={handleCloseNavMenu}
      >
        <List>
          {!user.isAdmin() ? (
            <h3>Legajo: {user.legajo}</h3>
          ) : (
            pages.map((page) =>
              page.links ? (
                <ListItem
                  sx={[sxStyles.flexColumn, style.navLinks]}
                  key={page.name}
                >
                  <ListItemButton onTouchStart={() => onTouchStart(page.name)}>
                    <h3 className={styles.item}>{page.name}</h3>
                    {dropdown === page.name ? <ExpandMore /> : <ChevronRight />}
                  </ListItemButton>
                  <Collapse sx={style.collapsible} in={dropdown === page.name}>
                    {page.links.map((link) => (
                      <ListItemButton key={link.name}>
                        <Link className={styles.subitem} to={link.link}>
                          {link.name}
                        </Link>
                      </ListItemButton>
                    ))}
                  </Collapse>
                </ListItem>
              ) : (
                <ListItem key={page.name}>
                  <Link
                    onClick={handleCloseNavMenu}
                    to={page.link}
                    className={styles.item}
                  >
                    {page.name}
                  </Link>
                </ListItem>
              )
            )
          )}
        </List>
      </Drawer>
    </>
  )
}

const style = {
  smallDrawer: { display: { xs: 'block', lg: 'none' } },
  navLinks: { alignItems: 'flex-start', padding: 0 },
  collapsible: { marginLeft: '20px' },
}

export default CustomDrawer
