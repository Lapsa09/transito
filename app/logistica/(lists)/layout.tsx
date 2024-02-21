'use client'

import Link from 'next/link'
import { useSelectedLayoutSegments } from 'next/navigation'
import React, { PropsWithChildren } from 'react'
import { useRouter } from 'next/navigation'

function layout({ children }: PropsWithChildren) {
  const title = useSelectedLayoutSegments()
  const router = useRouter()
  return (
    <div>
      <h1 className="text-center mb-5 capitalize">{title.at(-1)}</h1>
      <h1 className="cursor-pointer w-fit" onClick={router.back}>
        Atras
      </h1>
      {!(title[0].includes('repuestos') && title.length === 1) && (
        <Link href={`/logistica/${title.join('/')}/create`}>
          Nuevo {title.at(-1)}
        </Link>
      )}
      {children}
    </div>
  )
}

export default layout
