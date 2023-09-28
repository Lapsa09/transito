'use client'

import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import React, { PropsWithChildren } from 'react'

function layout({ children }: PropsWithChildren) {
  const title = useSelectedLayoutSegment()
  return (
    <div>
      <h1 className="text-center mb-5 capitalize">{title}</h1>
      <Link href={`/logistica/create/${title}`}>Nuevo Vehiculo</Link>
      {children}
    </div>
  )
}

export default layout
