'use client'

import { NextUIProvider } from '@nextui-org/react'
import { SessionProvider } from 'next-auth/react'
import React from 'react'

type AuthContextProps = {
  children: React.ReactNode | React.ReactNode[]
}

function AuthContext({ children }: AuthContextProps) {
  return (
    <SessionProvider>
      <NextUIProvider>{children}</NextUIProvider>
    </SessionProvider>
  )
}

export default AuthContext
