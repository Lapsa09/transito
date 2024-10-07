import React from 'react'
import MainForm from '@/components/forms/main.form'
import { FirstStep, SecondStep } from '@/components/forms/camiones.form'
import { getOperativosSelects } from '@/services'

export const dynamic = 'force-dynamic'

async function page() {
  const {
    vicenteLopez,
    turnos,
    motivos,
    resolucion,
    zonas,
    controlSustancias,
  } = await getOperativosSelects()
  return (
    <MainForm>
      <FirstStep selects={{ vicenteLopez, turnos }} />
      <SecondStep selects={{ motivos, resolucion, zonas, controlSustancias }} />
    </MainForm>
  )
}

export default page
