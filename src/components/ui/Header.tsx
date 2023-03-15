import React, { Fragment, useState } from 'react'
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
import { AppDispatch, IRootState } from '../../redux'
import { Roles, User } from '../../types'
import { LogoOVT, LogoVL } from './Logos'

const controles = [
  { link: '/control/diario', title: 'Diario' },
  { link: '/control/paseo', title: 'Paseo' },
]

const operativos = [
  { link: '/operativos/autos', title: 'Autos' },
  { link: '/operativos/motos', title: 'Motos' },
  { link: '/operativos/camiones', title: 'Camiones' },
]

const pages = [
  { name: 'Control', links: controles, permission: Roles.INSPECTOR },
  { name: 'Operativos', links: operativos, permission: Roles.INSPECTOR },
  { name: 'Sueldos', permission: Roles.ADMINISTRATIVO, link: '/sueldos' },
  { name: 'Waze', permission: Roles.WAZE, link: '/waze' },
  { name: 'Radio', permission: Roles.INSPECTOR, link: '/radio' },
]

function Header() {
  const [anchorElNav, setAnchorElNav] = useState(null)
  const dispatch = useDispatch<AppDispatch>()
  const [dropdown, setDropdown] = useState(null)
  const user = useSelector<IRootState, User>((x) => x.user.user)

  const onMouseEnter = (_menu) => {
    setDropdown(_menu)
  }

  const onTouchStart = (_menu) => {
    if (dropdown === _menu) setDropdown(null)
    else setDropdown(_menu)
  }

  const onMouseLeave = () => {
    setDropdown(false)
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
    onMouseLeave()
  }

  const handleLogout = () => {
    dispatch(authActions.logout())
  }

  return (
    <AppBar position="sticky" color="default">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <LogoVL link />
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: 'flex', lg: 'none' },
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '245px',
          }}
        >
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
            sx={{
              display: { xs: 'block', lg: 'none' },
            }}
            onClose={handleCloseNavMenu}
          >
            <List>
              {!user.isAdmin() ? (
                <h3>Legajo: {user.legajo}</h3>
              ) : (
                pages.map((page) =>
                  page.links ? (
                    <ListItem
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        padding: 0,
                      }}
                      key={page.name}
                    >
                      <ListItemButton
                        onTouchStart={() => onTouchStart(page.name)}
                        onMouseDown={() => onTouchStart(page.name)}
                      >
                        <h3 className={styles.item}>{page.name}</h3>
                        {dropdown === page.name ? (
                          <ExpandMore />
                        ) : (
                          <ChevronRight />
                        )}
                      </ListItemButton>
                      <Collapse
                        sx={{ marginLeft: '20px' }}
                        in={dropdown === page.name}
                      >
                        {page.links.map((link) => (
                          <ListItemButton key={link.title}>
                            <Link className={styles.subitem} to={link.link}>
                              {link.title}
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
          <Logout className={styles.logout} onClick={handleLogout} />
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: 'none', lg: 'flex' },
            alignItems: 'center',
            justifyContent: 'space-between',
            marginInline: '60px',
          }}
        >
          {pages
            .filter((page) => user.isAdmin() || user.rol === page.permission)
            .map((page) => (
              <div
                onMouseEnter={() => onMouseEnter(page.name)}
                onMouseLeave={onMouseLeave}
                onTouchStart={() => onMouseEnter(page.name)}
                className={styles['nav-link']}
                key={page.name}
              >
                {page.links ? (
                  <Fragment>
                    <h3 className={styles.item}>{page.name}</h3>
                    {dropdown === page.name && (
                      <CustomPopover links={page.links} />
                    )}
                  </Fragment>
                ) : (
                  <Link key={page.name} to={page.link} className={styles.item}>
                    {page.name}
                  </Link>
                )}
              </div>
            ))}
          <Logout className={styles.logout} onClick={handleLogout} />
        </Box>

        <LogoOVT />
      </Toolbar>
    </AppBar>
  )
}

export default Header
