import {
  kilometrajeInputSchema,
  logisticaForms,
  pedidoRepuestoSchema,
  proveedorInputSchema,
  reparacionInputSchema,
  vehiculoInputSchema,
  vtvInputSchema,
} from '@/schemas/logistica'
import { z } from 'zod'

export type Vehiculo = z.infer<typeof vehiculoInputSchema>

export type ReparacionForm = z.infer<typeof reparacionInputSchema>

export type PedidoForm = z.infer<typeof pedidoRepuestoSchema>

export type KilometrajeVehiculo = z.infer<typeof kilometrajeInputSchema>

export type Proveedor = z.infer<typeof proveedorInputSchema>

export type VTV = z.infer<typeof vtvInputSchema>

export type LogisticaForms = z.infer<typeof logisticaForms>
