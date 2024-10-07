import { z } from 'zod'
import {
  barrios,
  motivos,
  resolucion,
  seguridad,
  tipoLicencias,
  turnos,
  vicenteLopez,
} from '@/drizzle/schema/schema'
import { DOMINIO_PATTERN } from '@/utils/validations'
import { createSelectSchema } from 'drizzle-zod'

export const operativoInputSchema = z.object({
  legajo_a_cargo: z.coerce.number(),
  legajo_planilla: z.coerce.number(),
  seguridad: z.enum(seguridad.enumValues),
  qth: z.string(),
  localidad: createSelectSchema(vicenteLopez),
  fecha: z.string().date(),
  turno: z.enum(turnos.enumValues),
  hora: z.string().time(),
})

export const registroInputSchema = z.object({
  lpcarga: z.number().optional(),
  motivos: z.array(createSelectSchema(motivos).nullable()).optional(),
  dominio: z.string().regex(DOMINIO_PATTERN),
  zona_infractor: createSelectSchema(barrios),
  licencia: z.coerce.number().optional(),
  tipo_licencia: createSelectSchema(tipoLicencias).nullable(),
  resolucion: z.enum(resolucion.enumValues).nullable().default('PREVENCION'),
  acta: z.coerce.number().optional(),
  extranjero: z.boolean().default(false),
  control_sustancias: z.coerce.number().default(1),
})

export const motosInputPropsSchema =
  operativoInputSchema.merge(registroInputSchema)

const OperativoMoto = operativoInputSchema.merge(
  z.object({
    expiresAt: z.number(),
    localidad: createSelectSchema(vicenteLopez).optional(),
    turno: z.enum(turnos.enumValues).optional(),
    seguridad: z.enum(seguridad.enumValues).optional(),
    legajo_a_cargo: z.coerce.number().optional(),
    legajo_planilla: z.coerce.number().optional(),
  }),
)

export const DEFAULT_OPERATIVO_MOTO: z.infer<typeof OperativoMoto> = {
  fecha: '',
  turno: undefined,
  hora: '',
  qth: '',
  localidad: undefined,
  seguridad: undefined,
  legajo_a_cargo: undefined,
  legajo_planilla: undefined,
  expiresAt: 0,
}
