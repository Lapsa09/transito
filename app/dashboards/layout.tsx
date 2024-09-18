'use client'

import { usePathname } from 'next/navigation'
import React from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import Image from 'next/image'

function PathnameProvider({
  children,
}: {
  children: React.ReactNode | ((pathname: string) => React.ReactNode)
}) {
  const pathname = usePathname()

  return (
    <>
      {typeof children === 'function'
        ? children(pathname.split('/dashboards').at(-1) || 'estadisticas')
        : children}
    </>
  )
}

type Props = {
  children: React.ReactNode
}

function layout({ children }: Props) {
  return (
    <PathnameProvider>
      {(pathname) => {
        return (
          <Tabs value={pathname}>
            {children}
            <TabsList>
              <TabsTrigger asChild value="estadisticas">
                <Link replace href="/dashboards/">
                  Estadisticas
                </Link>
              </TabsTrigger>
              <TabsTrigger asChild value="/autos">
                <Link replace href="/dashboards/autos">
                  Control de Autos
                </Link>
              </TabsTrigger>
              <TabsTrigger asChild value="/motos">
                <Link replace href="/dashboards/motos">
                  Control de Motos
                </Link>
              </TabsTrigger>
              <TabsTrigger asChild value="/camiones">
                <Link replace href="/dashboards/camiones">
                  Control de Camiones
                </Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )
      }}
    </PathnameProvider>
  )
}

export default layout
