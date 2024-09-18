import React from 'react'
import MainForm from '@/components/forms/main.form'
import { FirstStep, SecondStep } from '@/components/forms/rio.form'
import { getOperativosSelects, getter } from '@/services'
import { z } from 'zod'
import { operativoInputSchema, registroInputSchema } from '@/schemas/rio'

async function page({ params: { id } }: { params: { id: string } }) {
  const {
    turnos,

    zonasPaseo,
  } = await getOperativosSelects()

  const { operativo, registro } = await getter<{
    registro: z.infer<typeof registroInputSchema>
    operativo: z.infer<typeof operativoInputSchema>
  }>({
    route: '/operativos/rio/' + id,
  })

  return (
    <MainForm>
      <FirstStep editableOperativo={operativo} selects={{ turnos }} />
      <SecondStep
        editableRegistro={registro}
        selects={{ zonasPaseo }}
        id={id}
      />
    </MainForm>
  )
}

export default page
