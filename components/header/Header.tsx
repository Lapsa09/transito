'use client'

import React from 'react'
import { LogoOVT, LogoVL } from '../Logos'
import Menu from './Menu'
import { useSession } from 'next-auth/react'
import { Roles } from '@/types'

function Header() {
  const session = useSession()

  if (session.status === 'unauthenticated' || session.status === 'loading')
    return null

  const user = session.data?.user

  const fullName = user?.nombre + ' ' + user?.apellido
  return (
    <nav className="border-gray-200 bg-white px-8 flex flex-wrap items-center justify-between shadow-[0_0_21px_-7px_rgba(0,0,0,0.41)] mb-4 sticky top-0 z-50">
      <LogoVL link />
      {user?.role === Roles.ADMIN ? (
        <Menu />
      ) : (
        <div className="flex justify-between">
          <h3 className="capitalize">
            {fullName} Legajo {user?.legajo}
          </h3>
        </div>
      )}
      <LogoOVT className="lg:order-3" />
    </nav>
  )
}

export default Header
