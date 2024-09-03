import {
  examenDTO,
  historialDTO,
  resultadoDTO,
  rindeExamenDTO,
} from '@/DTO/examen'
import { examenInputSchema } from '@/schemas/form'
import { z } from 'zod'

export type QuizResponse = z.infer<typeof examenInputSchema>

export type IPregunta = Awaited<ReturnType<typeof rindeExamenDTO>>

export type Alumno = Awaited<ReturnType<typeof examenDTO>>

export type Historial = Awaited<ReturnType<typeof historialDTO>>[0]

export type Resultado = Awaited<ReturnType<typeof resultadoDTO>>
