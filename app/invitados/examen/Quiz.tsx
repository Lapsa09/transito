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
  tiempo,
}: {
  preguntas: IPregunta['examen_preguntas']
  id: string
  tiempo: number
}) => {
  const router = useRouter()
  const ref = useRef<HTMLFormElement>(null)
  const documentRef = useRef<Document>(document)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [contador, setContador] = useSessionStorage<number>('contador', tiempo)
  const requestSubmit = () => ref.current?.requestSubmit(buttonRef.current)
  useEventListener(
    'visibilitychange',
    () => {
      if (document.hidden) {
        requestSubmit()
      }
    },
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
      requestSubmit()
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
        <div className="bg-warning-200 text-white">
          <h4 className="text-lg">AVISO</h4>
          <p>
            Si cierras esta ventana o cambias de pestaña, el examen se entregara
            automaticamente con lo que hayas realizado hasta el momento, y no
            podras volver a realizarlo.
          </p>
        </div>
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
        <Button
          isLoading={methods.formState.isSubmitting}
          ref={buttonRef}
          type="submit"
        >
          Finalizar examen
        </Button>
      </form>
    </FormProvider>
  )
}

export default dynamic(async () => Quiz, { ssr: false })
