'use client'
import React from 'react'
import { Links, Roles } from '@/types'
import Link from 'next/link'
import MenuButton from './MenuButton'
import { FiLogOut } from 'react-icons/fi'
import { signOut } from 'next-auth/react'
import { Button, Typography } from '@material-tailwind/react'
import Dropdown from './Dropdown'

const operativos: Links[] = [
  { link: '/operativos/autos', name: 'Autos' },
  { link: '/operativos/motos', name: 'Motos' },
  { link: '/operativos/camiones', name: 'Camiones' },
]

const pages: Links[] = [
  {
    name: 'Operativos',
    link: '/operativos',
    links: operativos,
    permission: Roles.INSPECTOR,
  },
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
        <ul className="flex-col md:flex-row flex md:space-x-8 mt-4 md:mt-0 md:text-md md:font-medium md:justify-between items-center">
          {pages.map((page) =>
            page.links ? (
              <Dropdown key={page.name} page={page} />
            ) : (
              <Link key={page.name} href={page.link}>
                <Button
                  variant="text"
                  key={page.name}
                  className="text-gray-700 md:hover:text-green-400 capitalize text-base font-medium"
                >
                  {page.name}
                </Button>
              </Link>
            )
          )}

          <Button variant="text" className="text-gray-700 hover:text-green-400">
            <Typography className="px-3 py-2 md:hidden">
              Cerrar sesion
            </Typography>
            <FiLogOut className="cursor-pointer text-xl" onClick={logout} />
          </Button>
        </ul>
      </div>
    </>
  )
}

export default Menu
