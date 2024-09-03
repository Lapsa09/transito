import {
  dependencia,
  pedidoRepuesto,
  proveedor,
  reparaciones,
  repuesto,
  tipoRepuesto,
  tipoVehiculo,
  uso,
} from '@/drizzle/schema/logistica'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const vehiculoInputSchema = z.object({
  patente: z.string(),
  marca: z.string(),
  modelo: z.string(),
  año: z.number(),
  nro_movil: z.string(),
  tipo_vehiculo: createSelectSchema(tipoVehiculo),
  uso: createSelectSchema(uso),
  dependencia: createSelectSchema(dependencia),
  seguro: z.string().optional(),
  tipo_motor: z.number().optional(),
  tipo_combustible: z.string().optional(),
  empresa_seguimiento: z.string().optional(),
  nro_chasis: z.string().optional(),
  id_megatrans: z.string().optional(),
  plan_renovacion: z.boolean().optional(),
})

export const reparacionInputSchema = createInsertSchema(reparaciones).merge(
  z.object({
    repuesto: createSelectSchema(repuesto),
  }),
)

export const pedidoRepuestoSchema = createInsertSchema(pedidoRepuesto).merge(
  z.object({
    repuestos: z.array(
      z.object({
        tipo_repuesto: createSelectSchema(tipoRepuesto),
        cantidad: z.number(),
        item: z.string(),
      }),
    ),
    proveedor: createSelectSchema(proveedor),
  }),
)

export const kilometrajeInputSchema = z.object({
  patente: z.string(),
  km: z.number(),
  fecha: z.string().date(),
  kit_poly_v: z.number(),
  kit_distribucion: z.number(),
  proximo_cambio_poly_v: z.number(),
  proximo_cambio_distribucion: z.number(),
  filtro_aceite: z.number(),
  proximo_cambio_filtro: z.number(),
})

export const proveedorInputSchema = createInsertSchema(proveedor)

export const vtvInputSchema = z.object({
  patente: z.string(),
  fecha_emision: z.string().date(),
  observacion: z.string().optional(),
  vencimiento: z.string().date(),
  estado: z.string().optional(),
  condicion: z.string().optional(),
})

export const logisticaForms = z.union([
  vehiculoInputSchema,
  kilometrajeInputSchema,
  reparacionInputSchema,
  vtvInputSchema,
  pedidoRepuestoSchema,
  proveedorInputSchema,
])
