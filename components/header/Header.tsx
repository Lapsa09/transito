'use client'

import React from 'react'
import { LogoOVT, LogoVL } from '../Logos'
import Menu from './Menu'
import { useSession } from 'next-auth/react'

function Header() {
  const session = useSession()

  if (session.status === 'unauthenticated') return null
  return (
    <nav className="border-gray-200 px-8 flex flex-wrap items-center justify-between shadow-[0_0_21px_-7px_rgba(0,0,0,0.41)] mb-4">
      <LogoVL link />
      <Menu />
      <LogoOVT className="lg:order-3" />
    </nav>
  )
}

export default Header
