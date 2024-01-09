import type { opciones, tipo_examen } from '@prisma/client'

export type Question = {
  id: number
  pregunta: string
  opciones: opciones[]
}

export type QuestionState = {
  elegida?: opciones
}

export type QuizResponse = {
  id: string
  preguntas: (opciones | null)[]
}
