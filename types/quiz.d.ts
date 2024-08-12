import { examenDTO, historialDTO } from '@/DTO/examen'
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

export type Respuesta = examen_preguntas & {
  pregunta: preguntas & { correcta: opciones }
  elegida?: opciones
}

export type Alumno = Awaited<ReturnType<typeof examenDTO>>

export type Historial = Awaited<ReturnType<typeof historialDTO>>[0]
