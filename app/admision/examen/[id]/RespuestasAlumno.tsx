'use client'
import React, { useState } from 'react'
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
import Loader from '@/components/Loader'
import { ExamenPreguntas, Opciones, Preguntas } from '@/drizzle/schema/examen'

type Respuesta = ExamenPreguntas & {
  pregunta: Preguntas & { correcta: Opciones }
  elegida?: Opciones
}

function RespuestasAlumnoCard({ id }: { id: string }) {
  const [open, setOpen] = useState(false)
  const { data, isLoading } = useSWR<Respuesta[]>(
    open ? { route: `/admision/examen/${id}/respuestas` } : null,
    getter,
    {},
  )

  const preguntasCorrectas = data?.filter(
    ({ elegidaId, pregunta }) => elegidaId === pregunta.idCorrecta,
  ).length

  const totalPreguntas = data?.length

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>Ver examen</DialogTrigger>
      <DialogContent className="overflow-y-auto h-dvh sm:max-w-5xl">
        {isLoading && <Loader />}

        <DialogHeader>
          <DialogTitle>Respuestas del alumno</DialogTitle>
          <DialogDescription>
            El alumno respondió correctamente {preguntasCorrectas} de{' '}
            {totalPreguntas} preguntas
          </DialogDescription>
        </DialogHeader>

        {data?.map((r, i) => (
          <div key={r.preguntaId}>
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
                className={`p-2 ml-1 text-sm ${r.elegidaId === r.pregunta.idCorrecta ? 'bg-green-800' : 'bg-red-800'} rounded-lg text-green-50`}
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
