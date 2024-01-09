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
import { useCountdown } from '@/hooks/useCountdown'
import { Button } from '@nextui-org/react'
import { useInvitado } from '@/hooks/useInvitado'
import { useLocalStorage } from 'usehooks-ts'
import dynamic from 'next/dynamic'

type IPregunta = examen_preguntas & {
  pregunta: preguntas & { opciones: opciones[] }
}

const Quiz = ({ id }: { id?: string }) => {
  const router = useRouter()
  const ref = useRef<HTMLButtonElement>(null)
  const [contador, setContador] = useLocalStorage<number | undefined>(
    'contador',
    1800,
  )
  const { seconds } = useCountdown({
    initialSeconds: contador,
  })
  const { setUsuario } = useInvitado()

  const { data = [] } = useSWR<IPregunta[]>(
    { route: '/examen/' + id + '/preguntas' },
    getter,
  )

  const onSubmit: SubmitHandler<QuizResponse> = async (body) => {
    await setter({ route: `examen/${id}`, body })
    setUsuario(undefined)
    setContador(undefined)
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
      className="text-white gap-5 grid px-5"
    >
      <Timer countdown={seconds} />
      {data?.map(({ preguntas_id, pregunta }, index) => {
        return (
          <CustomRadioGroup
            key={preguntas_id}
            label={`${index + 1}- ${pregunta.pregunta}`}
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

export default dynamic(async () => Quiz, { ssr: false })
