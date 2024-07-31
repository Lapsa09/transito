import React from 'react'
import Link from 'next/link'
import { Links } from '@/types'

function Dropdown({ page }: { page: Links }) {
  return (
    <div className="dropdown dropdown-hover">
      <Link
        href={page.link}
        tabIndex={0}
        role="button"
        className="btn btn-ghost text-gray-700 text-base font-medium font-sans md:hover:text-green-400"
      >
        {page.name}
      </Link>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-white rounded-box z-[1] w-52 p-2 shadow"
      >
        {page.links?.map((child) => (
          <li key={child.name}>
            <Link
              href={child.link}
              className="text-gray-700 hover:text-green-400"
            >
              {child.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Dropdown
