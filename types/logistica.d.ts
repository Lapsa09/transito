import {
  dependencia,
  kilometraje_vehiculos,
  logistica_tipo_vehiculo,
  movil,
  proveedor,
  reparaciones,
  uso,
  pedido_repuesto,
  repuesto,
  vtv,
  tipo_repuesto,
} from '@prisma/client'

export interface Vehiculo extends movil {
  uso: uso
  dependencia: dependencia
  tipo_vehiculo: logistica_tipo_vehiculo
  seguro?: string
}

export interface KilometrajeVehiculo extends kilometraje_vehiculos {}

export interface Reparacion extends reparaciones {
  repuesto: repuesto & {
    pedido_repuesto: pedido_repuesto & {
      proveedor: proveedor
    }
  }
  movil: movil
}

export type ReparacionForm = reparaciones & {
  repuesto: repuesto
}

export interface VTV extends vtv {}

export interface Repuesto extends repuesto {
  tipo_repuesto: tipo_repuesto
  reparacion: reparaciones
  pedido_repuesto: pedido_repuesto
}

export interface PedidoRepuesto extends pedido_repuesto {
  repuestos: Array<Repuesto & { cantidad: number }>
  proveedor: proveedor
}

export interface PedidoForm extends pedido_repuesto {
  repuestos: {
    tipo_repuesto: tipo_repuesto
    cantidad: number
    item: string
  }[]
}

export type LogisticaForms =
  | Vehiculo
  | KilometrajeVehiculo
  | ReparacionForm
  | VTV
  | Repuesto
  | PedidoForm
  | proveedor
  | stock
