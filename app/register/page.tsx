import React from 'react'
import { MainLogoOVT } from '@/components/Logos'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import RegisterForm from './RegisterForm'

function page() {
  return (
    <div className="max-w-5xl mx-auto bg-white p-16 dark:bg-black flex flex-col items-center">
      <MainLogoOVT />
      <RegisterForm />
      <p className="mt-2">
        Ya estas registrado?
        <Button asChild variant="link">
          <Link href="/login">Inicia sesion</Link>
        </Button>
      </p>
    </div>
  )
}

export default page
