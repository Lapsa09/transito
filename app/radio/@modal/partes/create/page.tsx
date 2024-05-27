import React from 'react'
import MainForm from '@/components/forms/main.form'
import { FirstStep, SecondStep } from './steps'

async function page() {
  return (
    <MainForm>
      <FirstStep />
      <SecondStep />
    </MainForm>
  )
}

export default page
