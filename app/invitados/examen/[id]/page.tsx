import React from 'react'
import { examen } from '@prisma/client'
import Waitzone from './Waitzone'
import { getter } from '@/services'

const getExamen = async (id: string) => {
  const examen = await getter<examen | null>({ route: `examen/${id}` })
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
