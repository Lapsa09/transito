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
  id: string
  dni: number
  email?: string | null
  tema: number
  tipo_examen: { id: number; tipo: string }
  preguntas: opciones[]
}
