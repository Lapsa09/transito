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
import { useRouter } from 'next/router'

function Dropdown({ page }: { page: Links }) {
  const router = useRouter()
  return (
    <Menu allowHover>
      <MenuHandler>
        <Button
          variant="text"
          onClick={() => router.push(page.link)}
          className="text-gray-700 md:hover:text-green-400 font-sans text-base font-medium capitalize"
        >
          {page.name}
        </Button>
      </MenuHandler>
      <MenuList>
        {page.links?.map((link) => (
          <Link href={link.link}>
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
