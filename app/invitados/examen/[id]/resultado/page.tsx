import { getter } from '@/services'
import { calificacion, rinde_examen } from '@prisma/client'
import React from 'react'

const getExamen = async (id: string) => {
  const data = await getter<rinde_examen & { calificacion: calificacion }>({
    route: `/examen/${id}/resultado`,
  })
  return data
}

async function page({ params }: { params: { id: string } }) {
  const examen = await getExamen(params.id)
  return (
    <div>
      <h1>Resultado</h1>
      <p>El examen ha finalizado</p>
      <p>Resultado: {examen.calificacion.nota}</p>
      <p>{examen.calificacion.resultado}</p>
    </div>
  )
}

export default page
