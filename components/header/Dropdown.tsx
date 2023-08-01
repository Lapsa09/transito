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
        <Button
          variant="text"
          className="text-gray-700 md:hover:text-green-400 font-sans text-base font-medium capitalize"
        >
          {page.name}
        </Button>
      </MenuHandler>
      <MenuList>
        {page.links?.map((link) => (
          <MenuItem key={link.name} className="hover:text-green-400">
            <Link href={link.link!}>{link.name}</Link>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}

export default Dropdown
