'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
// Components
import Button from '@/components/Button'
import CustomRadioGroup from '@/components/RadioGroup'
import { RegularForm } from '@/components/forms/layout.form'
// Types
import { SubmitHandler } from 'react-hook-form'
import { Question, QuizResponse } from '@/types/quiz'

type Props = {
  preguntas: Question[]
}

const Quiz = ({ preguntas }: Props) => {
  const router = useRouter()

  const onSubmit: SubmitHandler<QuizResponse> = (data) => {
    console.log(data)
  }

  return (
    <RegularForm
      onSubmit={onSubmit}
      defaultValues={{ preguntas: [] }}
      className="text-white text-center"
    >
      {preguntas.map(({ id, opciones, pregunta }, index) => {
        return (
          <CustomRadioGroup
            key={id}
            label={pregunta}
            options={opciones}
            name={'preguntas.' + index}
          />
        )
      })}
      <Button type="submit">Finalizar</Button>
    </RegularForm>
  )
}

export default Quiz
