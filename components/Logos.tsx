'use client'
import Image from 'next/image'
import React from 'react'
import logoVL from '@/assets/imgs/LOGO_V_LOPEZ.png'
import logoOVT from '@/assets/imgs/OVT_LETRAS_NEGRAS.png'
import { useRouter } from 'next/navigation'

export const LogoVL = ({ link = false }: { link?: boolean }) => {
  const router = useRouter()

  const onClick = () => {
    if (link) {
      router.replace('/')
    }
  }

  return (
    <div className="h-20 w-64 relative">
      <Image
        src={logoVL}
        onClick={onClick}
        style={{ objectFit: 'contain' }}
        fill
        className={`${link ? 'cursor-pointer' : ''} `}
        alt="Logo Vicente Lopez"
      />
    </div>
  )
}

export const LogoOVT = ({ className }: { className?: string }) => {
  return (
    <div className="h-20 w-64 relative">
      <Image
        src={logoOVT}
        style={{ objectFit: 'contain' }}
        className={className}
        alt="Logo Observatorio Vial"
        fill
      />
    </div>
  )
}

export const MainLogoOVT = () => {
  return (
    <Image
      src={logoOVT}
      style={{ maxHeight: 'inherit' }}
      alt="Logo Observatorio Vial"
    />
  )
}
