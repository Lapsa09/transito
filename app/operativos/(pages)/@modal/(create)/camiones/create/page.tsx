import React from 'react'
import MainForm from '@/components/forms/main.form'
import { FirstStep, SecondStep } from '@/components/forms/camiones.form'
import { getSelects } from '@/services'

async function page() {
  const { vicenteLopez, turnos, motivos, resolucion, zonas } =
    await getSelects()
  return (
    <MainForm>
      <FirstStep selects={{ vicenteLopez, turnos }} />
      <SecondStep selects={{ motivos, resolucion, zonas }} />
    </MainForm>
  )
}

export default page
