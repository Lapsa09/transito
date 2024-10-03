'use client'

import MenuButton from './MenuButton'
import { Button } from '@/components/ui'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Links } from '@/types'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion'
import { cn } from '@/lib/utils'
import { LogoVL } from '../Logos'

export default function SheetDemo({ pages }: { pages: Links[] }) {
  const session = useSession()
  return session.status === 'authenticated' ? (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'ml-3 text-gray-400 hover:text-green-400 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg inline-flex items-center justify-center',
            'lg:hidden self-center',
          )}
          aria-controls="mobile-menu-2"
          aria-expanded="false"
        >
          <MenuButton />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <LogoVL className="mx-auto" />
        {pages.map((page) =>
          page.links ? (
            <Accordion
              type="single"
              collapsible
              key={page.name}
              title={page.name}
            >
              <AccordionItem value={page.name} key={page.name}>
                <AccordionTrigger className="text-sm">
                  {page.name}
                </AccordionTrigger>
                <AccordionContent className="flex flex-col items-start">
                  {page.links.map((child) => (
                    <Button
                      variant="link"
                      key={child.name}
                      className="text-gray-700 hover:text-green-400"
                    >
                      <Link href={child.link}>{child.name}</Link>
                    </Button>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : (
            <SheetTitle key={page.name} className="py-4 font-medium">
              <Button
                variant="link"
                className="text-black hover:text-green-400 px-0"
              >
                <Link href={page.link}>{page.name}</Link>
              </Button>
            </SheetTitle>
          ),
        )}
      </SheetContent>
    </Sheet>
  ) : null
}
