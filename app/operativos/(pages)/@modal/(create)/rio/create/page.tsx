import React from 'react'
import MainForm from '@/components/forms/main.form'
import { FirstStep, SecondStep } from '@/components/forms/rio.form'
import { getSelects } from '@/services'

async function page() {
  const { turnos, zonasPaseo } = await getSelects()
  return (
    <MainForm>
      <FirstStep selects={{ turnos }} />
      <SecondStep selects={{ zonasPaseo }} />
    </MainForm>
  )
}

export default page