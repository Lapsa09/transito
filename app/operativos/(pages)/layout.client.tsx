'use client'

import React from 'react'
import useSWRInmutable from 'swr/immutable'
import { getter } from '@/services'
import Loader from '@/components/Loader'

function LayoutClient(props: { children: React.ReactNode }) {
  const { isLoading } = useSWRInmutable<Record<string, string[]>>(
    { route: '/filters' },
    getter,
    {},
  )

  if (isLoading) return <Loader />
  return (
    <main className="flex flex-col items-center gap-3">{props.children}</main>
  )
}

export default LayoutClient
