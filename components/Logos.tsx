'use client'
import Image from 'next/image'
import React from 'react'
import logoVL from '@/assets/imgs/LOGO_V_LOPEZ.png'
import logoOVT from '@/assets/imgs/OVT_LETRAS_NEGRAS.png'
import { useRouter } from 'next/navigation'
import { twMerge } from 'tailwind-merge'

export const LogoVL = ({ link = false }: { link?: boolean }) => {
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
      className={`${
        link ? 'cursor-pointer' : ''
      } object-contain sm:h-20 sm:w-64 h-14 w-40`}
      alt="Logo Vicente Lopez"
      sizes="(max-width: 540px) 10rem, 16rem"
    />
  )
}

export const LogoOVT = ({ className }: { className?: string }) => {
  return (
    <Image
      src={logoOVT}
      className={twMerge(className, 'object-contain sm:h-12 sm:w-40 h-8 w-20')}
      alt="Logo Observatorio Vial"
      sizes="(max-width: 540px) 5rem, 10rem"
    />
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
