import MainForm from '@/components/forms/main.form'
import { steps } from '@/components/forms/rio.form'
import React from 'react'

function page() {
  return <MainForm steps={steps} />
}

export default page
