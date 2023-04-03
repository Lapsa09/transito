import React from 'react'
import { Box, styled, Button } from '@mui/material'
import { Menu, Sidebar } from 'react-admin'
import { history, sxStyles } from '../utils'

const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  zIndex: 1,
  backgroundColor: theme.palette.background.default,
  position: 'relative',
}))

const ContentWithSidebar = styled('main')(({ theme }) => ({
  display: 'flex',
  flexGrow: 1,
}))

const Content = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 2,
  paddingLeft: 5,
}))

const LayoutWithoutAppbar = ({ children, dashboard }) => (
  <Root>
    <ContentWithSidebar>
      <Sidebar sx={style.sidebar}>
        <Menu hasDashboard={!!dashboard} />
      </Sidebar>
      <Content>{children}</Content>
    </ContentWithSidebar>
  </Root>
)

const LayoutWithoutSidebar = ({ children }) => (
  <Box sx={[sxStyles.flexColumn, style.sidebar]}>
    <AppBar />
    {children}
  </Box>
)

function AppBar() {
  const { pathname } = history.location
  const [, , location, subroute] = pathname.split('/')

  return (
    <Box sx={[sxStyles.flexColumnCenter, style.appbar]}>
      {!subroute && (
        <Box sx={[sxStyles.spaceBetween, style.appbarContent]}>
          {location === 'moviles' ? (
            <Button
              variant="outlined"
              onClick={() => history.navigate('/radio/operarios')}
            >
              Operarios
            </Button>
          ) : (
            <h3 style={sxStyles.noMargin}>Operarios</h3>
          )}
          {location === 'operarios' ? (
            <Button
              variant="outlined"
              onClick={() => history.navigate('/radio/moviles')}
            >
              Moviles
            </Button>
          ) : (
            <h3 style={sxStyles.noMargin}>Moviles</h3>
          )}
        </Box>
      )}
    </Box>
  )
}

const style = {
  sidebar: { height: 'calc(100vh - 76px)' },
  appbar: { marginTop: 2 },
  appbarContent: { width: '25%' },
}

export { LayoutWithoutAppbar, LayoutWithoutSidebar }
