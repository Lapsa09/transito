'use client'

import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
// Components
import CustomRadioGroup from '@/components/RadioGroup'
import { RegularForm } from '@/components/forms/layout.form'
// Types
import { SubmitHandler } from 'react-hook-form'
import { QuizResponse } from '@/types/quiz'
import useSWR from 'swr'
import { getter, setter } from '@/services'
import { examen_preguntas, opciones, preguntas } from '@prisma/client'
import Timer from '@/components/Timer'
import { useCountdown } from 'usehooks-ts'
import { Button } from '@nextui-org/react'

type IPregunta = examen_preguntas & {
  pregunta: preguntas & { opciones: opciones[] }
}

type IExamen = {
  examen: IPregunta[]
  habilitado: boolean
}

const Quiz = ({ id }: { id?: string }) => {
  const router = useRouter()
  const ref = useRef<HTMLButtonElement>(null)
  const [countdown, { startCountdown, stopCountdown }] = useCountdown({
    countStart: 1800,
  })

  const { data } = useSWR<IExamen>({ route: '/examen/' + id }, getter)

  const onSubmit: SubmitHandler<QuizResponse> = async (body) => {
    await setter({ route: `examen/${id}`, body })
    router.push('/invitados/examen/resultado')
  }

  useEffect(() => {
    if (!countdown) {
      ref.current?.click()
    }
    return () => {
      stopCountdown()
    }
  }, [countdown])

  useEffect(() => {
    startCountdown()
  }, [])

  return (
    <RegularForm
      defaultValues={{ id, preguntas: [] }}
      onSubmit={onSubmit}
      className="text-white text-center"
    >
      <Timer countdown={countdown} />
      {data?.examen?.map(({ preguntas_id, pregunta }, index) => {
        return (
          <CustomRadioGroup
            key={preguntas_id}
            label={pregunta.pregunta}
            options={pregunta.opciones}
            name={'preguntas.' + index}
          />
        )
      })}
      <Button ref={ref} type="submit">
        Finalizar examen
      </Button>
    </RegularForm>
  )
}

export default Quiz
