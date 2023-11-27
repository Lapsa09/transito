import React from 'react'
import { LogoOVT, LogoVL } from '../Logos'
import Menu from './Menu'

function Header() {
  return (
    <header className="border-gray-200 bg-white px-8 flex flex-wrap items-center justify-between shadow-[0_0_21px_-7px_rgba(0,0,0,0.41)] mb-4 sticky top-0 z-40">
      <LogoVL link />
      <Menu />
      <LogoOVT className="lg:order-3" />
    </header>
  )
}

export default Header
