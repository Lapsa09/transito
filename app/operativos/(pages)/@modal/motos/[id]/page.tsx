import React from 'react'
import MainForm from '@/components/forms/main.form'
import { FirstStep, SecondStep } from '@/components/forms/motos.form'
import { getOperativosSelects, getter } from '@/services'
import { z } from 'zod'
import { operativoInputSchema, registroInputSchema } from '@/schemas/motos'

async function page({ params: { id } }: { params: { id: string } }) {
  const {
    vicenteLopez,
    turnos,
    seguridad,
    licencias,
    motivos,
    resolucion,
    zonas,
  } = await getOperativosSelects()

  const { operativo, registro } = await getter<{
    registro: z.infer<typeof registroInputSchema>
    operativo: z.infer<typeof operativoInputSchema>
  }>({
    route: '/operativos/motos/' + id,
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
        id={id}
      />
    </MainForm>
  )
}

export default page
