import React from 'react'
import MainForm from '@/components/forms/main.form'
import { FirstStep, SecondStep } from '@/components/forms/motos.form'
import { getOperativosSelects } from '@/services'

export const dynamic = 'force-dynamic'

async function page() {
  const {
    vicenteLopez,
    turnos,
    seguridad,
    licencias,
    motivos,
    resolucion,
    zonas,
  } = await getOperativosSelects()
  return (
    <MainForm>
      <FirstStep selects={{ vicenteLopez, turnos, seguridad }} />
      <SecondStep selects={{ licencias, motivos, resolucion, zonas }} />
    </MainForm>
  )
}

export default page
