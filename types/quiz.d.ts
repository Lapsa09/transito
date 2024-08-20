import {
  Examen,
  ExamenPreguntas,
  Opciones,
  Preguntas,
  RindeExamen,
} from '@/drizzle/schema/examen'
import { examenDTO, historialDTO } from '@/DTO/examen'

export type Question = {
  id: number
  pregunta: string
  opciones: Opciones[]
}

export type QuestionState = {
  elegida?: Opciones
}

export type QuizResponse = {
  id: string
  preguntas: (Opciones | null)[]
  tiempo: Date
}

export type IPregunta = RindeExamen & {
  examen_preguntas: (ExamenPreguntas & {
    pregunta: Omit<Preguntas, 'id_correcta'> & { opciones: Opciones[] }
    elegida?: Opciones
  })[]
  examen: Examen
}

export type Respuesta = ExamenPreguntas & {
  pregunta: Preguntas & { correcta: Opciones }
  elegida?: Opciones
}

export type Alumno = Awaited<ReturnType<typeof examenDTO>>

export type Historial = Awaited<ReturnType<typeof historialDTO>>[0]
