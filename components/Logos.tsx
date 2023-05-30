'use client'
import { useMediaQuery, useTheme } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import logoVL from '@/assets/imgs/LOGO_V_LOPEZ.png'
import logoOVT from '@/assets/imgs/OVT_LETRAS_NEGRAS.png'
import { useRouter } from 'next/navigation'

export const LogoVL = ({ link = false }: { link?: boolean }) => {
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('sm'))
  const router = useRouter()

  const onClick = () => {
    if (link) {
      router.replace('/')
    }
  }

  return (
    <Image
      src={logoVL}
      onClick={onClick}
      className={`${link && 'cursor-pointer'}`}
      alt="Logo Vicente Lopez"
      height={matches ? 70 : 40}
    />
  )
}

export const LogoOVT = ({ className }: { className?: string }) => {
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('sm'))
  return (
    <Image
      src={logoOVT}
      className={className}
      alt="Logo Observatorio Vial"
      height={matches ? 70 : 40}
    />
  )
}

export const MainLogoOVT = () => {
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('sm'))
  return (
    <Image
      src={logoOVT}
      style={{ maxHeight: 'inherit' }}
      alt="Logo Observatorio Vial"
      height={matches ? 200 : 150}
    />
  )
}
