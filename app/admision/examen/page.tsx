import React from 'react'
import CreateExamButton from './CreateExamButton'
import CreatedExam from './CreatedExam'
import { examen } from '@prisma/client'
import { fetcher } from '@/services'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

const getExamenes = async () => {
  const response = await fetcher('/api/examen', {
    next: { revalidate: 3600 * 24 },
  })
  const examenes: examen[] = await response.json()
  return examenes
}

async function page() {
  const examenes = await getExamenes()
  return (
    <div className="flex">
      <div className="flex-auto ml-10">
        <Link
          href="/admision/examen/historial"
          className="text-xl font-semibold text-center mb-10"
        >
          Examenes terminados
        </Link>

        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold text-center mb-10">Nuevo examen</h1>
          <CreateExamButton />
        </div>
      </div>
      <div className="flex-initial mr-10">
        <h1 className="text-xl font-semibold text-center mb-10">
          Examenes sin terminar
        </h1>
        <div className="max-h-[750px] overflow-y-auto gap-5 grid p-2">
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
