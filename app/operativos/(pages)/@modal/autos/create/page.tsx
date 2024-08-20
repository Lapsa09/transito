import React from 'react'
import MainForm from '@/components/forms/main.form'
import { FirstStep, SecondStep } from '@/components/forms/autos.form'
import { getSelects } from '@/services'
import FormHeader from './header'
import CustomModal from '@/components/Modal'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

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
    <CustomModal>
      <div className="flex flex-col justify-center items-center px-6">
        <FormHeader />
        <MainForm>
          <FirstStep selects={{ vicenteLopez, turnos, seguridad }} />
          <SecondStep selects={{ licencias, motivos, resolucion, zonas }} />
        </MainForm>
      </div>
    </CustomModal>
  )
}

export default page
