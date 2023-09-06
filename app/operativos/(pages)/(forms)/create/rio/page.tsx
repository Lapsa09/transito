import React from 'react'
import MainForm from '@/components/forms/main.form'
import { steps } from '@/components/forms/rio.form'

function page() {
  return <MainForm steps={steps} />
}

export default page
