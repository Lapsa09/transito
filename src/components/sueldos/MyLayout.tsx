// in src/MyLayout.js
import React from 'react'
import { styled } from '@mui/material'
import { Menu, Sidebar } from 'react-admin'

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

const MyLayout = ({ children, dashboard }) => (
  <Root>
    <ContentWithSidebar>
      <Sidebar sx={{ height: 'calc(100vh - 76px)' }}>
        <Menu hasDashboard={!!dashboard} />
      </Sidebar>
      <Content>{children}</Content>
    </ContentWithSidebar>
  </Root>
)

export default MyLayout
