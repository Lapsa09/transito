import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { authActions } from '../../redux/userSlice'
import CustomPopover from './Popover'
import styles from '../../styles/Home.module.css'
import { Logout } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { Box, AppBar, Toolbar } from '@mui/material'
import { AppDispatch, IRootState } from '../../redux'
import { Links, Roles, User } from '../../types'
import { LogoOVT, LogoVL } from './Logos'
import { sxStyles } from '../../utils'
import CustomDrawer from './CustomDrawer'

const controles: Links[] = [
  { link: '/control/diario', name: 'Diario' },
  { link: '/control/paseo', name: 'Paseo' },
]

const operativos: Links[] = [
  { link: '/operativos/autos', name: 'Autos' },
  { link: '/operativos/motos', name: 'Motos' },
  { link: '/operativos/camiones', name: 'Camiones' },
]

const pages: Links[] = [
  { name: 'Control', links: controles, permission: Roles.INSPECTOR },
  { name: 'Operativos', links: operativos, permission: Roles.INSPECTOR },
  { name: 'Sueldos', permission: Roles.ADMINISTRATIVO, link: '/sueldos' },
  { name: 'Waze', permission: Roles.WAZE, link: '/waze' },
  { name: 'Radio', permission: Roles.INSPECTOR, link: '/radio' },
]

function Header() {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector<IRootState, User>((x) => x.user.user)

  const handleLogout = () => {
    dispatch(authActions.logout())
  }

  return (
    <AppBar position="sticky" color="default">
      <Toolbar sx={[sxStyles.spaceBetween]}>
        <LogoVL link />
        <Box sx={[sxStyles.flexSmall, style.smallHeader]}>
          <CustomDrawer pages={pages} />
          <Logout className={styles.logout} onClick={handleLogout} />
        </Box>
        <Box sx={[sxStyles.flexLarge, style.largeHeader]}>
          {pages
            .filter((page) => user.isAdmin() || user.rol === page.permission)
            .map((page) => {
              return page.links ? (
                <CustomPopover
                  key={page.name}
                  name={page.name}
                  links={page.links}
                />
              ) : (
                <Link key={page.name} to={page.link} className={styles.item}>
                  {page.name}
                </Link>
              )
            })}
          <Logout className={styles.logout} onClick={handleLogout} />
        </Box>
        <LogoOVT />
      </Toolbar>
    </AppBar>
  )
}

const style = {
  smallHeader: { flexGrow: 1, maxWidth: '245px' },
  largeHeader: { flexGrow: 1, marginInline: '60px' },
}

export default Header
