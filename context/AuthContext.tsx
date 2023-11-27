'use client'

import { NextUIProvider } from '@nextui-org/react'
import { SessionProvider } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React from 'react'

type AuthContextProps = {
  children: React.ReactNode | React.ReactNode[]
}

function AuthContext({ children }: AuthContextProps) {
  const router = useRouter()
  return (
    <SessionProvider>
      <NextUIProvider navigate={router.push}>{children}</NextUIProvider>
    </SessionProvider>
  )
}

export default AuthContext
