import React, { Fragment, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LogoVL from '../../assets/imgs/LOGO_V_LOPEZ.png'
import LogoOVT from '../../assets/imgs/OVT_LETRAS_NEGRAS.png'
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
import { history } from '../../utils'

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
  { name: 'Control', links: controles, permission: 'INSPECTOR' },
  { name: 'Operativos', links: operativos, permission: 'INSPECTOR' },
  { name: 'Sueldos', permission: 'ADMINISTRATIVO', link: '/sueldos' },
  { name: 'Waze', permission: 'TRAFICO', link: '/waze' },
]

function Header() {
  const [anchorElNav, setAnchorElNav] = useState(null)
  const dispatch = useDispatch()
  const [dropdown, setDropdown] = useState(null)
  const user = useSelector((x) => x.user.user)

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
        <Box sx={{ maxHeight: { xs: '30px', sm: '70px' }, cursor: 'pointer' }}>
          <img
            src={LogoVL}
            onClick={() => history.navigate('/')}
            alt="Logo Vicente Lopez"
          />
        </Box>
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
              {pages
                .filter(
                  (page) => user.rol === 'ADMIN' || user.rol === page.permission
                )
                .map((page) =>
                  page.links ? (
                    <ListItem
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        padding: '0',
                      }}
                      key={page.name}
                    >
                      <ListItemButton
                        onTouchStart={() => onTouchStart(page.name)}
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
            .filter(
              (page) => user.rol === 'ADMIN' || user.rol === page.permission
            )
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
        <Box sx={{ maxHeight: { xs: '30px', sm: '70px' } }}>
          <img src={LogoOVT} alt="Logo Observatorio Vial" />
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
