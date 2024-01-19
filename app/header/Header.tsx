import React from 'react'
import { LogoVL } from '@/components/Logos'
import Menu from './Menu'

function Header() {
  return (
    <header className="border-gray-200 bg-white px-8 flex flex-wrap items-center justify-between shadow-[0_0_21px_-7px_rgba(0,0,0,0.41)] header w-full">
      <LogoVL link />
      <Menu />
    </header>
  )
}

export default Header
