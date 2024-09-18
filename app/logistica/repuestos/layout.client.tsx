'use client'
import { Button } from '@/components/ui/button'
import { useRouter, useSelectedLayoutSegments } from 'next/navigation'
import React from 'react'
import { IoReload } from 'react-icons/io5'

function layoutClient({ children }: React.PropsWithChildren) {
  const router = useRouter()
  const title = useSelectedLayoutSegments()
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
      {children}
    </div>
  )
}

export default layoutClient
