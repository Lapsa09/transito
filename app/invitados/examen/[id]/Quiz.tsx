'use client'

import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { RegularForm } from '@/components/forms/layout.form'
import { SubmitHandler } from 'react-hook-form'
import { IPregunta, QuizResponse } from '@/types/quiz'
import { setter } from '@/services'
import { useCountdown } from '@/hooks/useCountdown'
import { Button } from '@nextui-org/react'
import { useSessionStorage } from 'usehooks-ts'
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
  const ref = useRef<HTMLButtonElement>(null)
  const [contador, setContador] = useSessionStorage<number>('contador', 1800)
  const { seconds } = useCountdown({
    initialSeconds: contador,
  })

  const onSubmit: SubmitHandler<QuizResponse> = async (body) => {
    await setter({
      route: `examen/${id}`,
      body: { ...body, tiempo: new Date() },
    })
    router.push(`/invitados/examen/${id}/resultado`)
  }

  useEffect(() => {
    setContador(seconds)
    if (!seconds) {
      ref.current?.click()
    }
  }, [seconds])

  return (
    <RegularForm
      defaultValues={{ id, preguntas: [] }}
      onSubmit={onSubmit}
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
      <Button ref={ref} type="submit">
        Finalizar examen
      </Button>
    </RegularForm>
  )
}

export default dynamic(async () => Quiz, { ssr: false })
