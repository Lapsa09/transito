'use client'

import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import React, { PropsWithChildren } from 'react'

function layout({
  children,
  modal,
}: PropsWithChildren<{ modal: React.ReactNode }>) {
  const title = useSelectedLayoutSegment()
  return (
    <div>
      <h1 className="text-center mb-5 capitalize">{title}</h1>
      <Link href={`/logistica/create/${title}`}>Nuevo Vehiculo</Link>
      {children}
      {modal}
    </div>
  )
}

export default layout
