import { Box } from '@mui/material'
import React from 'react'
import logoVL from '../../assets/imgs/LOGO_V_LOPEZ.png'
import logoOVT from '../../assets/imgs/OVT_LETRAS_NEGRAS.png'
import { basicMaxHeight, basicWidth, history } from '../../utils'

export const LogoVL = ({ link = false }) => {
  return (
    <Box sx={{ ...basicMaxHeight, cursor: link ? 'pointer' : 'initial' }}>
      <img
        src={logoVL}
        onClick={link ? () => history.navigate('/') : null}
        alt="Logo Vicente Lopez"
      />
    </Box>
  )
}

export const LogoOVT = () => {
  return (
    <Box sx={{ ...basicMaxHeight }}>
      <img src={logoOVT} alt="Logo Observatorio Vial" />
    </Box>
  )
}

export const MainLogoOVT = () => {
  return (
    <Box
      sx={{
        ...basicWidth,
        textAlign: 'center',
      }}
    >
      <img
        style={{ width: 'inherit' }}
        src={logoOVT}
        alt="Logo Observatorio Vial"
      />
    </Box>
  )
}
