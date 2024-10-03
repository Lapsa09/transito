import { zonas } from '@/drizzle/schema/nuevo_control'
import { turnos } from '@/drizzle/schema/schema'
import { DOMINIO_PATTERN } from '@/utils/validations'
import { createSelectSchema } from 'drizzle-zod'

import { z } from 'zod'

export const operativoInputSchema = z.object({
  lp: z.coerce.number(),
  fecha: z.string().date(),
  turno: z.enum(turnos.enumValues),
  hora: z.string().time(),
})

export const registroInputSchema = z.object({
  lpcarga: z.number().optional(),
  dominio: z.string().regex(DOMINIO_PATTERN),
  extranjero: z.boolean().default(false),
  zona: createSelectSchema(zonas),
})

export const rioInputPropsSchema =
  operativoInputSchema.merge(registroInputSchema)

const OperativoRio = z.object({
  fecha: z.string().date().optional(),
  turno: z.enum(turnos.enumValues).optional(),
  lp: z.coerce.number().optional(),
  hora: z.string().time(),
  expiresAt: z.number(),
})

export const DEFAULT_OPERATIVO_RIO: z.infer<typeof OperativoRio> = {
  fecha: '',
  turno: undefined,
  lp: undefined,
  expiresAt: 0,
  hora: '',
}
