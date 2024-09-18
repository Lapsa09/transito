import {
  motivos,
  resolucion,
  turnos,
  vicenteLopez,
} from '@/drizzle/schema/schema'
import { localidad_destino, localidad_origen } from '@/DTO/operativos/camiones'
import { DOMINIO_PATTERN } from '@/utils/validations'
import { createSelectSchema } from 'drizzle-zod'

import { z } from 'zod'

export const operativoInputSchema = z.object({
  legajo: z.coerce.number(),
  qth: z.string(),
  localidad: createSelectSchema(vicenteLopez),
  fecha: z.string().date(),
  turno: z.enum(turnos.enumValues),
})

export const registroInputSchema = z.object({
  hora: z.string().time(),
  lpcarga: z.number().optional(),
  origen: z.string().optional(),
  destino: z.string().optional(),
  localidad_origen: createSelectSchema(localidad_origen),
  localidad_destino: createSelectSchema(localidad_destino),
  motivo: createSelectSchema(motivos).optional(),
  dominio: z.string().regex(DOMINIO_PATTERN),
  licencia: z.coerce.number(),
  resolucion: z.enum(resolucion.enumValues).nullable().default('PREVENCION'),
  acta: z.coerce.number().optional(),
  extranjero: z.boolean().default(false),
  remito: z.boolean(),
  carga: z.boolean(),
})

export const camionesInputPropsSchema =
  operativoInputSchema.merge(registroInputSchema)

const OperativoCamion = operativoInputSchema.merge(
  z.object({
    expiresAt: z.number(),
    localidad: createSelectSchema(vicenteLopez).optional(),
    turno: z.enum(turnos.enumValues).optional(),
    legajo: z.coerce.number().optional(),
  }),
)

export const DEFAULT_OPERATIVO_CAMION: z.infer<typeof OperativoCamion> = {
  fecha: '',
  turno: undefined,
  qth: '',
  localidad: undefined,
  legajo: undefined,
  expiresAt: 0,
}
