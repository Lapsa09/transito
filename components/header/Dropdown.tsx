import React from 'react'
import Link from 'next/link'
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from '@material-tailwind/react'
import { Links } from '@/types'

function Dropdown({ page }: { page: Links }) {
  return (
    <Menu allowHover>
      <MenuHandler>
        <Link href={page.link}>
          <Button
            variant="text"
            className="text-gray-700 md:hover:text-green-400 font-sans text-base font-medium capitalize"
          >
            {page.name}
          </Button>
        </Link>
      </MenuHandler>
      <MenuList>
        {page.links?.map((link) => (
          <Link key={link.name} href={link.link}>
            <MenuItem key={link.name} className="hover:text-green-400">
              {link.name}
            </MenuItem>
          </Link>
        ))}
      </MenuList>
    </Menu>
  )
}

export default Dropdown
