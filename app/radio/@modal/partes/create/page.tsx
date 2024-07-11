import React from 'react'
import MainForm from '@/components/forms/main.form'
import { FirstStep, SecondStep } from './steps'
import { getter } from '@/services'
import { Inspector } from '@/types/radio'

const getOperarios = async () => {
  const operarios = await getter<Inspector[]>({
    route: 'inspectores',
  })

  return operarios.map(({ legajo, usuario }) => ({
    legajo: legajo.toString(),
    nombre: usuario ? `${usuario.nombre} ${usuario.apellido}` : '',
  }))
}

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
