import type { opciones } from '@prisma/client'

export type Question = {
  id: number
  pregunta: string
  opciones: opciones[]
}

export type QuestionState = {
  elegida?: opciones
}

export type QuizResponse = {
  id: number
  dni: number
  email: string
  tema: number
  preguntas: QuestionState[]
}
