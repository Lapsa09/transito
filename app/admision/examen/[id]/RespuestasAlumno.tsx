'use client'
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import useSWR from 'swr'
import { getter } from '@/services'
import { examen_preguntas, opciones, preguntas } from '@prisma/client'
import Loader from '@/components/Loader'

type Respuesta = examen_preguntas & {
  pregunta: preguntas & { correcta: opciones }
  elegida?: opciones
}

function RespuestasAlumnoCard({ id }: { id: string }) {
  const { data, isLoading } = useSWR<Respuesta[]>(
    { route: `/admision/examen/${id}/respuestas` },
    getter,
    {},
  )
  return (
    <Dialog>
      <DialogTrigger>Ver examen</DialogTrigger>
      <DialogContent className="overflow-y-auto h-unit-9xl sm:max-w-5xl">
        {isLoading && <Loader />}

        <DialogHeader>
          <DialogTitle>Respuestas del alumno</DialogTitle>
          <DialogDescription>
            El alumno respondió correctamente{' '}
            {
              data?.filter((r) => r.elegida_id === r.pregunta.id_correcta)
                .length
            }{' '}
            de
            {' ' + data?.length} preguntas
          </DialogDescription>
        </DialogHeader>

        {data?.map((r, i) => (
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
      </DialogContent>
    </Dialog>
  )
}

export default RespuestasAlumnoCard
