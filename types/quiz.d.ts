import type {
  examen,
  examen_preguntas,
  opciones,
  preguntas,
  rinde_examen,
  tipo_examen,
} from '@prisma/client'

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
  tiempo: Date
}

export type IPregunta = rinde_examen & {
  examen_preguntas: (examen_preguntas & {
    pregunta: Omit<preguntas, 'id_correcta'> & { opciones: opciones[] }
    elegida?: opciones
  })[]
  examen: examen
}
