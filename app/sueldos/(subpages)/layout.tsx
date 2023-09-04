'use client'

import React from 'react'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

function layout({ children }: React.PropsWithChildren) {
  const segment = useSelectedLayoutSegment()
  return (
    <div>
      <nav className="flex">
        <Link href="/sueldos">Atras</Link>
        <h1 className="w-full uppercase text-center">{segment}</h1>
      </nav>
      {children}
    </div>
  )
}

export default layout
