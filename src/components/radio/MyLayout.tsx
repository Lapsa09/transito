import React from 'react'
import { Box, Button } from '@mui/material'
import { history, sxStyles } from '../../utils'

const MyLayout = ({ children }) => (
  <Box sx={[sxStyles.flexColumn, { minHeight: 'calc(100vh - 76px)' }]}>
    <AppBar />
    {children}
  </Box>
)

function AppBar() {
  const { pathname } = history.location
  const [, , location, subroute] = pathname.split('/')

  return (
    <Box sx={[sxStyles.flexColumnCenter, { marginTop: 2 }]}>
      {!subroute && (
        <Box sx={[sxStyles.spaceBetween, { width: '25%' }]}>
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

export default MyLayout
