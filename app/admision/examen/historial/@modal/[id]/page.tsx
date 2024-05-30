import { getter } from '@/services'
import { examen_preguntas, opciones, preguntas } from '@prisma/client'
import React from 'react'
import Modal from '@/components/Modal'
import { DialogHeader } from '@/components/ui/dialog'
import { ModalBody } from '@nextui-org/react'

type Respuesta = examen_preguntas & {
  pregunta: preguntas & { correcta: opciones }
  elegida?: opciones
}

async function page({ params }: { params: { id: string } }) {
  const { id } = params
  const data = await getter<Respuesta[]>({
    route: `/admision/examen/${id}/respuestas`,
  })
  return (
    <Modal>
      <DialogHeader>
        <h1 className="text-lg font-semibold leading-none tracking-tight">
          Respuestas del alumno
        </h1>
        <p className="text-sm text-muted-foreground">
          El alumno respondió correctamente{' '}
          {data?.filter((r) => r.elegida_id === r.pregunta.id_correcta).length}{' '}
          de
          {' ' + data?.length} preguntas
        </p>
      </DialogHeader>
      <ModalBody>
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
      </ModalBody>
    </Modal>
  )
}

export default page
