import { Button } from '@/components/ui'
import { getter } from '@/services'
import { examen } from '@prisma/client'
import Link from 'next/link'
import React from 'react'
import CreateExamButton from './CreateExamButton'
import CreatedExam from './CreatedExam'

const getExamenes = async () => {
  const response = await getter<examen[]>({ route: '/invitados/examen' })

  return response
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

async function page() {
  const examenes = await getExamenes()
  return (
    <div className="flex px-10">
      <div className="flex-auto flex items-center flex-col">
        <h1 className="text-3xl font-bold text-center mb-8">Nuevo examen</h1>
        <CreateExamButton />
      </div>
      <div>
        <Button variant="link" asChild>
          <Link
            href="/admision/examen/historial"
            className="text-xl font-semibold text-center mb-10"
          >
            Examenes terminados
          </Link>
        </Button>
        <h1 className="text-xl font-semibold text-center mb-10">
          Examenes sin terminar
        </h1>
        <div className="max-h-[600px] overflow-y-auto gap-5 grid p-2">
          {examenes.length > 0 ? (
            examenes.map((examen) => (
              <CreatedExam key={examen.id} examen={examen} />
            ))
          ) : (
            <span className="text-gray-400">No hay examenes agendados</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default page
