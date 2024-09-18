'use client'

import Link from 'next/link'
import { useSelectedLayoutSegments } from 'next/navigation'
import React, { PropsWithChildren } from 'react'
import { useRouter } from 'next/navigation'
import { IoReload } from 'react-icons/io5'
import { Button } from '@/components/ui/button'

function LayoutClient({ children }: PropsWithChildren) {
  const title = useSelectedLayoutSegments()
  const router = useRouter()
  return (
    <div>
      <h1 className="text-center mb-5 capitalize">
        {title.at(-1)}
        <Button variant="link" onClick={router.refresh}>
          <IoReload />
        </Button>
      </h1>
      <h1 className="cursor-pointer w-fit" onClick={router.back}>
        Atras
      </h1>

      <Link href={`/logistica/${title.join('/')}/create`}>
        Nuevo {title.at(-1)}
      </Link>

      {children}
    </div>
  )
}

export default LayoutClient
