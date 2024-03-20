import React from 'react'
import Link from 'next/link'
import { MainLogoOVT } from '@/components/Logos'
import LoginForm from './LoginForm'

function page() {
  return (
    <div className="max-w-2xl mx-auto bg-white p-16 dark:bg-black flex flex-col items-center">
      <MainLogoOVT />
      <LoginForm />
      <p>
        Todavia no te registraste? <Link href="/register">Registrate aca</Link>
      </p>
    </div>
  )
}

export default page
