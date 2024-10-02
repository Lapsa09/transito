import { opciones } from '@/drizzle/schema/examen'
import { clientes, operarios } from '@/drizzle/schema/sueldos'
import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const registerUserPropsSchema = z.object({
  legajo: z.number(),
  password: z.string(),
  confirmPassword: z.string(),
})

export const loginUserPropsSchema = z.object({
  legajo: z.string().optional(),
  password: z.string().optional(),
  dni: z.string().optional(),
})

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  operator: z.enum(['and', 'or']).optional().default('and'),
})

export const examenInputSchema = z.object({
  id: z.string(),
  preguntas: z
    .array(createSelectSchema(opciones).nullable())
    .refine((arr) => arr.length === 40 || arr.length === 80),
  tiempo: z.string().datetime().default(new Date().toISOString()),
})

export const serviciosPropsSchema = z.object({
  cliente: createSelectSchema(clientes).merge(z.object({ acopio: z.number() })),
  hay_recibo: z.boolean(),
  recibo: z.number().optional(),
  fecha_recibo: z.string().optional(),
  importe_recibo: z.number().optional(),
  acopio: z.number(),
  fecha_servicio: z.string(),
  feriado: z.boolean().optional().default(false),
  memo: z.string().optional(),
  operarios: z.array(
    z.object({
      operario: createSelectSchema(operarios).optional(),
      hora_inicio: z.string().time(),
      hora_fin: z.string().time(),
      a_cobrar: z.number(),
      cancelado: z.boolean().default(false),
    }),
  ),
  importe_servicio: z.number(),
})
