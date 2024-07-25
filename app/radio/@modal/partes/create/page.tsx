import React from 'react'
import MainForm from '@/components/forms/main.form'
import { FirstStep, SecondStep } from './steps'
import { getter } from '@/services'
import { Inspector } from '@/types/radio'

const getOperarios = async () => {
  const operarios = await getter<Inspector[]>({
    route: 'inspectores',
  })

  return operarios.map(({ legajo, nombre, apellido }) => ({
    legajo: legajo.toString(),
    nombre: `${nombre} ${apellido}`,
  }))
}

export const fetchCache = 'force-no-store'
export const dynamic = 'force-dynamic'

async function page() {
  const operarios = await getOperarios()
  return (
    <MainForm>
      <FirstStep />
      <SecondStep operarios={operarios} />
    </MainForm>
  )
}

export default page
