import { steps } from '@/components/forms/logistica/vehiculos.form'
import MainForm from '@/components/forms/main.form'
import React from 'react'

function page() {
  return <MainForm steps={steps} />
}

export default page
