import React from 'react'
import MainForm from '@/components/forms/main.form'
import { FirstStep, SecondStep } from '@/components/forms/camiones.form'
import { getSelects } from '@/services'
import CustomModal from '@/components/Modal'
import FormHeader from './header'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

async function page() {
  const { vicenteLopez, turnos, motivos, resolucion, zonas } =
    await getSelects()
  return (
    <CustomModal>
      <div className="flex flex-col justify-center items-center px-6">
        <FormHeader />
        <MainForm>
          <FirstStep selects={{ vicenteLopez, turnos }} />
          <SecondStep selects={{ motivos, resolucion, zonas }} />
        </MainForm>
      </div>
    </CustomModal>
  )
}

export default page
