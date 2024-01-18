import React from 'react'
import MainForm from '@/components/forms/main.form'
import { FirstStep, SecondStep } from '@/components/forms/motos.form'
import { getSelects } from '@/services'

async function page() {
  const {
    vicenteLopez,
    turnos,
    seguridad,
    licencias,
    motivos,
    resolucion,
    zonas,
  } = await getSelects()
  return (
    <MainForm>
      <FirstStep selects={{ vicenteLopez, turnos, seguridad }} />
      <SecondStep selects={{ licencias, motivos, resolucion, zonas }} />
    </MainForm>
  )
}

export default page
