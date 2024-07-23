'use client'

import MenuButton from '@/app/header/MenuButton'
import { Button } from '@/components/ui'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Links } from '@/types'
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import Link from 'next/link'

export default function SheetDemo({ pages }: { pages: Links[] }) {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden">
        <MenuButton />
      </SheetTrigger>
      <SheetContent side="left">
        {pages.map((page) =>
          page.links ? (
            <Popover key={page.name} placement="right">
              <PopoverTrigger>
                <SheetTitle>
                  <Button
                    className="text-gray-700 hover:text-green-400"
                    variant="link"
                  >
                    {page.name}
                  </Button>
                </SheetTitle>
              </PopoverTrigger>
              <PopoverContent>
                {page.links.map((subpage) => (
                  <SheetDescription key={subpage.name}>
                    <Link href={subpage.link}>{subpage.name}</Link>
                  </SheetDescription>
                ))}
              </PopoverContent>
            </Popover>
          ) : (
            <SheetTitle key={page.name}>
              <Button
                variant="link"
                className="text-gray-700 hover:text-green-400"
              >
                <Link href={page.link}>{page.name}</Link>
              </Button>
            </SheetTitle>
          ),
        )}
      </SheetContent>
    </Sheet>
  )
}
