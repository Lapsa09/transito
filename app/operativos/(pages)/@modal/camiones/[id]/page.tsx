import React from 'react'
import MainForm from '@/components/forms/main.form'
import { FirstStep, SecondStep } from '@/components/forms/camiones.form'
import { getOperativosSelects, getter } from '@/services'
import { z } from 'zod'
import { operativoInputSchema, registroInputSchema } from '@/schemas/camiones'

async function page({ params }: { params: { id: string } }) {
  const { id } = params
  const { vicenteLopez, turnos, motivos, resolucion, zonas } =
    await getOperativosSelects()

  const { operativo, registro } = await getter<{
    registro: z.infer<typeof registroInputSchema>
    operativo: z.infer<typeof operativoInputSchema>
  }>({
    route: '/operativos/camiones/' + id,
  })

  return (
    <MainForm>
      <FirstStep
        editableOperativo={operativo}
        selects={{ vicenteLopez, turnos }}
      />
      <SecondStep
        editableRegistro={registro}
        selects={{ motivos, resolucion, zonas }}
        id={id}
      />
    </MainForm>
  )
}

export default page
