'use client'
import { Drawer } from '@/components'
import { useSelectedLayoutSegment } from 'next/navigation'
import React from 'react'

function layout({ children }: { children: React.ReactNode }) {
  const segment = useSelectedLayoutSegment()
  return (
    <div>
      <div className="flex">
        <Drawer />
        <h1 className="w-full uppercase text-center">{segment}</h1>
      </div>
      {children}
    </div>
  )
}

export default layout
