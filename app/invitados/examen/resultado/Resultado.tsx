'use client'

import { Button } from '@/components/ui'
import { Respuesta } from '@/types/quiz'
import { calificacion, rinde_examen } from '@prisma/client'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

function Resultado({
  examen,
  respuestas,
}: {
  examen: rinde_examen & { calificacion: calificacion }
  respuestas: Respuesta[]
}) {
  const router = useRouter()
  const preguntasCorrectas = respuestas.filter(
    ({ elegida_id, pregunta }) => elegida_id === pregunta.id_correcta,
  ).length

  const totalPreguntas = respuestas.length
  const inicio = async () => {
    router.push('/login/invitado')
  }

  useEffect(() => {
    signOut({ redirect: false })
  }, [])

  return (
    <div>
      <h1>El examen ha finalizado</h1>
      <p>Resultado: {examen.calificacion.nota}</p>
      <p>{examen.calificacion.resultado}</p>
      <div>
        <h1>Respuestas del alumno</h1>
        <p>
          El alumno respondió correctamente {preguntasCorrectas} de{' '}
          {totalPreguntas} preguntas
        </p>
      </div>
      <Button onClick={inicio}>Volver al inicio</Button>
      <div className="overflow-y-auto max-h-96">
        {respuestas.map((r, i) => (
          <div key={r.preguntas_id}>
            <h3
              className="text-lg font-semibold"
              dangerouslySetInnerHTML={{
                __html: i + 1 + '- ' + r.pregunta.pregunta,
              }}
            />

            <p className="flex flex-col">
              Correcta:
              <span
                className="p-2 mb-1 ml-1 text-sm bg-green-800 rounded-lg text-green-50"
                dangerouslySetInnerHTML={{
                  __html: r.pregunta.correcta.respuesta,
                }}
              />
            </p>
            <p className="flex flex-col">
              Elegida:
              <span
                className={`p-2 ml-1 text-sm ${r.elegida_id === r.pregunta.id_correcta ? 'bg-green-800' : 'bg-red-800'} rounded-lg text-green-50`}
                dangerouslySetInnerHTML={{
                  __html:
                    r.elegida?.respuesta ??
                    'El alumno no respondió esta pregunta',
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
