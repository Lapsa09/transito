import React from 'react'
import { steps } from '@/components/forms/motos.form'
import MainForm from '@/components/forms/main.form'

function page() {
  return <MainForm steps={steps} />
}

export default page