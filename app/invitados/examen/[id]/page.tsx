import React from 'react'
import { examen } from '@prisma/client'
import Waitzone from './Waitzone'

const getExamen = async (id: string) => {
  const examen: examen | null = await fetch(`/api/examen/${id}`).then((res) =>
    res.json(),
  )
  return examen
}

async function page({ params }: { params: { id: string } }) {
  const examen = await getExamen(params.id)

  return (
    <div>
      <h1>Examen</h1>

      <Waitzone examen={examen} />
    </div>
  )
}

export default page
