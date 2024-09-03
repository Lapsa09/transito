'use client'

import { Button } from '@/components/ui'
import type { Resultado as Resultados } from '@/types/quiz'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

function Resultado({ examen }: { examen: Resultados }) {
  const router = useRouter()
  const preguntasCorrectas = examen.preguntas.filter(
    ({ id_correcta, id_elegida }) => id_correcta === id_elegida,
  ).length

  const totalPreguntas = examen.preguntas.length
  const inicio = async () => {
    router.push('/login/invitado')
  }

  useEffect(() => {
    signOut({ redirect: false })
  }, [])

  return (
    <div>
      <h1>El examen ha finalizado</h1>
      <p>Resultado: {examen.nota}</p>
      <p>{examen.calificacion}</p>
      <div>
        <h1>Respuestas del alumno</h1>
        <p>
          El alumno respondió correctamente {preguntasCorrectas} de{' '}
          {totalPreguntas} preguntas
        </p>
      </div>
      <Button onClick={inicio}>Volver al inicio</Button>
      <div className="overflow-y-auto max-h-96">
        {examen.preguntas.map((r, i) => (
          <div key={r.id}>
            <h3
              className="text-lg font-semibold"
              dangerouslySetInnerHTML={{
                __html: i + 1 + '- ' + r.pregunta,
              }}
            />

            <p className="flex flex-col">
              Correcta:
              <span
                className="p-2 mb-1 ml-1 text-sm bg-green-800 rounded-lg text-green-50"
                dangerouslySetInnerHTML={{
                  __html: r.correcta,
                }}
              />
            </p>
            <p className="flex flex-col">
              Elegida:
              <span
                className={`p-2 ml-1 text-sm ${r.id_elegida === r.id_correcta ? 'bg-green-800' : 'bg-red-800'} rounded-lg text-green-50`}
                dangerouslySetInnerHTML={{
                  __html: r.elegida ?? 'El alumno no respondió esta pregunta',
                }}
              />
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Resultado
