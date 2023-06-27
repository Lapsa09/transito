'use client'

import { SessionProvider } from 'next-auth/react'
import React from 'react'

type AuthContextProps = {
  children: React.ReactNode | React.ReactNode[]
}

function AuthContext({ children }: AuthContextProps) {
  return <SessionProvider>{children}</SessionProvider>
}

export default AuthContext
