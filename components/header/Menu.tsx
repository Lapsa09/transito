'use client'
import React from 'react'
import { Links, Roles } from '@/types'
import Link from 'next/link'
import MenuButton from './MenuButton'
import Dropdown from './Dropdown'
import { FiLogOut } from 'react-icons/fi'
import { signOut } from 'next-auth/react'

const controles: Links[] = [
  { link: '/control/diario', name: 'Diario' },
  { link: '/control/paseo', name: 'Paseo' },
]

const operativos: Links[] = [
  { link: '/operativos/autos', name: 'Autos' },
  { link: '/operativos/motos', name: 'Motos' },
  { link: '/operativos/camiones', name: 'Camiones' },
]

const pages: Links[] = [
  { name: 'Control', links: controles, permission: Roles.INSPECTOR },
  { name: 'Operativos', links: operativos, permission: Roles.INSPECTOR },
  { name: 'Sueldos', permission: Roles.ADMINISTRATIVO, link: '/sueldos' },
  { name: 'Waze', permission: Roles.WAZE, link: '/waze' },
  { name: 'Radio', permission: Roles.INSPECTOR, link: '/radio' },
]

function Menu() {
  const logout = () => {
    signOut({ callbackUrl: '/login' })
  }
  return (
    <>
      <MenuButton />
      <div className="hidden lg:block w-full md:w-1/2">
        <ul className="flex-col md:flex-row flex md:space-x-8 mt-4 md:mt-0 md:text-md md:font-medium md:justify-between">
          {pages.map((page) =>
            page.links ? (
              <Dropdown key={page.name} page={page} />
            ) : (
              <li key={page.name}>
                <Link
                  href={page.link!}
                  className="text-gray-700 hover:bg-gray-50 border-b border-gray-100 md:hover:bg-transparent md:border-0 block pl-3 pr-4 py-2 md:hover:text-green-400 md:p-0"
                >
                  {page.name}
                </Link>
              </li>
            )
          )}
          <li>
            <button className="px-3 py-2 md:hidden">Cerrar sesion</button>
            <FiLogOut className="cursor-pointer" onClick={logout} />
          </li>
        </ul>
      </div>
    </>
  )
}

export default Menu
