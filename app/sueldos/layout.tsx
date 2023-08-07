'use client'
import { useSelectedLayoutSegment } from 'next/navigation'
import React from 'react'

function layout({ children }: React.PropsWithChildren) {
  const segment = useSelectedLayoutSegment()
  return (
    <div>
      <h1 className="w-full uppercase text-center">{segment}</h1>

      {children}
    </div>
  )
}

export default layout
