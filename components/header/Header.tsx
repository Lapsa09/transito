'use client'

import React from 'react'
import { LogoOVT, LogoVL } from '../Logos'
import Menu from './Menu'
import { useSession } from 'next-auth/react'
import { Roles } from '@/types'
import { Typography } from '@material-tailwind/react'

function Header() {
  const session = useSession()

  if (session.status === 'unauthenticated') return null

  const user = session.data?.user

  const fullName = user?.nombre + ' ' + user?.apellido
  return (
    <nav className="border-gray-200 px-8 flex flex-wrap items-center justify-between shadow-[0_0_21px_-7px_rgba(0,0,0,0.41)] mb-4">
      <LogoVL link />
      {user?.role === Roles.ADMIN ? (
        <Menu />
      ) : (
        <div className="flex justify-between">
          <Typography>{fullName}</Typography>
          <Typography>Legajo {user?.legajo}</Typography>
        </div>
      )}
      <LogoOVT className="lg:order-3" />
    </nav>
  )
}

export default Header
