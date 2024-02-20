'use client'

import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { IPregunta, QuizResponse } from '@/types/quiz'
import { setter } from '@/services'
import { useCountdown } from '@/hooks/useCountdown'
import { Button } from '@nextui-org/react'
import { useEventListener, useSessionStorage } from 'usehooks-ts'
import CustomRadioGroup from '@/components/RadioGroup'
import Timer from '@/components/Timer'
import dynamic from 'next/dynamic'

const Quiz = ({
  preguntas,
  id,
}: {
  preguntas: IPregunta['examen_preguntas']
  id: string
}) => {
  const router = useRouter()
  const ref = useRef<HTMLFormElement>(null)
  const documentRef = useRef<Document>(document)
  const [contador, setContador] = useSessionStorage<number>('contador', 1800)
  useEventListener('pagehide', () => ref.current?.requestSubmit())
  useEventListener(
    'visibilitychange',
    () => document.hidden && ref.current?.requestSubmit(),
    documentRef,
  )
  const methods = useForm<QuizResponse>({
    defaultValues: { id, preguntas: [] },
  })
  const { seconds } = useCountdown({
    initialSeconds: contador,
  })

  const onSubmit: SubmitHandler<QuizResponse> = async (body) => {
    await setter({
      route: `examen/${id}`,
      body: { ...body, tiempo: new Date() },
    })
    router.push(`/invitados/examen/resultado`)
  }

  useEffect(() => {
    setContador(seconds)
    if (!seconds) {
      ref.current?.requestSubmit()
    }
  }, [seconds])

  return (
    <FormProvider {...methods}>
      <form
        ref={ref}
        onSubmit={methods.handleSubmit(onSubmit)}
        className="gap-5 grid px-5"
      >
        <Timer countdown={seconds} />
        <section className="max-h-unit-8xl overflow-y-auto text-white gap-5 grid">
          {preguntas.map(({ preguntas_id, pregunta }, index) => {
            return (
              <CustomRadioGroup
                key={preguntas_id}
                label={`${index + 1}- ${pregunta.pregunta}`}
                options={pregunta.opciones}
                name={'preguntas.' + index}
              />
            )
          })}
        </section>
        <Button type="submit">Finalizar examen</Button>
      </form>
    </FormProvider>
  )
}

export default dynamic(async () => Quiz, { ssr: false })
