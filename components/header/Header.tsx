import React from 'react'
import { LogoVL } from '@/components/Logos'
import Menu from './Menu'
import Drawer from './Drawer'
import { pages } from '@/utils/pages'

function Header() {
  return (
    <header className="border-gray-200 bg-white px-8 flex flex-wrap items-center justify-between shadow-[0_0_21px_-7px_rgba(0,0,0,0.41)] header w-full">
      <div className="grid gap-10 w-full md:w-fit grid-cols-3 lg:grid-cols-1">
        <Drawer pages={pages} />

        <LogoVL link className="col-span-2 md:col-span-1" />
      </div>
      <Menu />
    </header>
  )
}

export default Header
