import React from 'react'
import MainForm from '@/components/forms/main.form'
import { FirstStep, SecondStep } from '@/components/forms/autos.form'
import { getSelects } from '@/services'
import PageClient from './page.client'

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
    <PageClient>
      <MainForm>
        <FirstStep selects={{ vicenteLopez, turnos, seguridad }} />
        <SecondStep selects={{ licencias, motivos, resolucion, zonas }} />
      </MainForm>
    </PageClient>
  )
}

export default page
