'use client'
import React from 'react'
import { User } from '@/types'
import Link from 'next/link'
import { FiLogOut } from 'react-icons/fi'
import { signOut, useSession } from 'next-auth/react'
import Dropdown from './Dropdown'
import { pages } from '@/utils/pages'
import { Button } from '../ui'

function Menu() {
  const { data } = useSession()
  const user = data?.user
  const logout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  if (!user) return null
  const fullName = user.nombre + ' ' + user.apellido

  const credentials = (user: User) => {
    if ('dni' in user) {
      return 'DNI ' + user.dni
    }
    return 'Legajo ' + user.legajo
  }
  return (
    <div className="hidden lg:block w-full md:w-1/2">
      <ul className="flex mt-4 md:mt-0 md:text-md md:font-medium md:justify-between items-center">
        {user.metaData.isAdmin ? (
          pages.map((page) =>
            page.links ? (
              <Dropdown key={page.name} page={page} />
            ) : (
              <Link key={page.name} href={page.link}>
                <Button
                  variant="link"
                  key={page.name}
                  className="text-gray-700 md:hover:text-green-400 capitalize text-base font-medium"
                >
                  {page.name}
                </Button>
              </Link>
            ),
          )
        ) : (
          <div className="flex justify-between">
            <h3 className="capitalize">
              {fullName} {credentials(user)}
            </h3>
          </div>
        )}
        <Button
          variant="ghost"
          onClick={logout}
          className="text-gray-700 hover:text-green-400"
        >
          <p className="px-3 py-2 md:hidden">Cerrar sesion</p>
          <FiLogOut className="cursor-pointer text-xl" />
        </Button>
      </ul>
    </div>
  )
}

export default Menu
