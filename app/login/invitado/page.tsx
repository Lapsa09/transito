import React from 'react'
import { MainLogoOVT } from '@/components/Logos'
import LoginForm from './LoginForm'

function page() {
  return (
    <div className="max-w-2xl mx-auto bg-white p-16 dark:bg-black flex flex-col items-center">
      <MainLogoOVT />
      <h1>Login de invitado</h1>
      <LoginForm />
    </div>
  )
}

export default page
