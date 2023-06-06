import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Links } from '@/types'

function Dropdown({ page }: { page: Links }) {
  const dropdownRef = useRef<HTMLLIElement>(null)
  const [isMenuDropDownOpen, setMenuDropDownOpen] = useState(false)

  const openHoverMenu = () => {
    setMenuDropDownOpen(true)
  }

  const closeHoverMenu = () => {
    setMenuDropDownOpen(false)
  }

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (
        !dropdownRef.current ||
        dropdownRef.current.contains(event.target as Node)
      ) {
        return
      }
      closeHoverMenu()
    }
    document.addEventListener('mouseover', listener)
    return () => {
      document.removeEventListener('mouseover', listener)
    }
  }, [dropdownRef, closeHoverMenu])

  return (
    <li key={page.name} ref={dropdownRef}>
      <button
        className="relative text-gray-700 hover:bg-gray-50 border-b border-gray-100 md:hover:bg-transparent md:border-0 pl-3 pr-4 py-8 md:hover:text-green-400 md:p-0 font-medium flex items-center justify-between w-full md:w-auto"
        onMouseOver={openHoverMenu}
      >
        {page.name}
      </button>
      {isMenuDropDownOpen && (
        <ul className="absolute z-50 w-36 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {page.links!.map((link) => (
            <li key={link.name}>
              <Link
                href={link.link!}
                onClick={closeHoverMenu}
                className="px-4 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 md:hover:bg-transparent md:border-0 pl-3 pr-4 py-2 md:hover:text-green-400 font-medium flex items-center justify-between w-full md:w-auto"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

export default Dropdown
