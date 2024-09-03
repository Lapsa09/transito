import React from 'react'
import MainForm from '@/components/forms/main.form'
import { FirstStep, SecondStep } from '@/components/forms/autos.form'
import { getOperativosSelects, getter } from '@/services'
import { z } from 'zod'
import { operativoInputSchema, registroInputSchema } from '@/schemas/autos'

async function page({ params }: { params: { id: string } }) {
  const {
    vicenteLopez,
    turnos,
    seguridad,
    licencias,
    motivos,
    resolucion,
    zonas,
  } = await getOperativosSelects()

  const { registro, operativo } = await getter<{
    registro: z.infer<typeof registroInputSchema>
    operativo: z.infer<typeof operativoInputSchema>
  }>({
    route: '/operativos/autos/' + params.id,
  })

  return (
    <MainForm>
      <FirstStep
        editableOperativo={operativo}
        selects={{ vicenteLopez, turnos, seguridad }}
      />
      <SecondStep
        editableRegistro={registro}
        selects={{ licencias, motivos, resolucion, zonas }}
        id={params.id}
      />
    </MainForm>
  )
}

export default page
