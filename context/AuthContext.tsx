'use client'

import { NextUIProvider } from '@nextui-org/react'
import { I18nProvider } from '@react-aria/i18n'
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
      <NextUIProvider navigate={router.push}>
        <I18nProvider locale="es-AR">{children}</I18nProvider>
      </NextUIProvider>
    </SessionProvider>
  )
}

export default AuthContext
