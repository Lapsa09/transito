'use client'

import Link from 'next/link'
import { useSelectedLayoutSegments } from 'next/navigation'
import React, { PropsWithChildren } from 'react'

function layout({ children }: PropsWithChildren) {
  const title = useSelectedLayoutSegments()

  return (
    <div>
      <h1 className="text-center mb-5 capitalize">{title.at(-1)}</h1>
      <Link href={`/logistica/create/${title.join('/')}`}>
        Nuevo {title.at(-1)}
      </Link>
      {children}
    </div>
  )
}

export default layout
