import { getter } from '@/services'
import React from 'react'
import Modal from '@/components/Modal'
import { DialogHeader } from '@/components/ui/dialog'
import { ModalBody } from '@nextui-org/react'
import { ExamenPreguntas, Opciones, Preguntas } from '@/drizzle/schema/examen'

type Respuesta = ExamenPreguntas & {
  pregunta: Preguntas & { correcta: Opciones }
  elegida?: Opciones
}

async function page({ params }: { params: { id: string } }) {
  const { id } = params
  const data = await getter<Respuesta[]>({
    route: `/admision/examen/${id}/respuestas`,
  })
  const preguntasCorrectas = data.filter(
    ({ elegidaId, pregunta }) => elegidaId === pregunta.idCorrecta,
  ).length

  const totalPreguntas = data.length
  return (
    <Modal>
      <DialogHeader>
        <h1 className="text-lg font-semibold leading-none tracking-tight">
          Respuestas del alumno
        </h1>
        <p className="text-sm text-muted-foreground">
          El alumno respondió correctamente {preguntasCorrectas} de{' '}
          {totalPreguntas} preguntas
        </p>
      </DialogHeader>
      <ModalBody>
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
      </ModalBody>
    </Modal>
  )
}

export default page
