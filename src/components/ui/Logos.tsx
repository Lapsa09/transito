import { Box } from '@mui/material'
import React from 'react'
import logoVL from '../../assets/imgs/LOGO_V_LOPEZ.png'
import logoOVT from '../../assets/imgs/OVT_LETRAS_NEGRAS.png'
import { sxStyles } from '../../utils'
import { useNavigate } from 'react-router-dom'

export const LogoVL = ({ link = false }) => {
  const navigate = useNavigate()
  return (
    <Box
      sx={[sxStyles.basicMaxHeight, { cursor: link ? 'pointer' : 'initial' }]}
    >
      <img
        src={logoVL}
        onClick={link ? () => navigate('/') : null}
        alt="Logo Vicente Lopez"
      />
    </Box>
  )
}

export const LogoOVT = () => {
  return (
    <Box sx={sxStyles.basicMaxHeight}>
      <img src={logoOVT} alt="Logo Observatorio Vial" />
    </Box>
  )
}

export const MainLogoOVT = () => {
  return (
    <Box sx={[style.height, style.text]}>
      <img
        src={logoOVT}
        style={{ maxHeight: 'inherit' }}
        alt="Logo Observatorio Vial"
      />
    </Box>
  )
}

const style = {
  text: { textAlign: 'center' },
  height: {
    maxHeight: { xs: '150px', sm: '200px' },
  },
}
