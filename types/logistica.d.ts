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
}

export interface KilometrajeVehiculo extends kilometraje_vehiculos {}

export interface Reparacion extends reparaciones {
  suministro: pedido_repuesto & {
    proveedor: proveedor
    repuesto: repuesto
  }
  movil: movil
}

export type ReparacionForm = reparaciones & {
  repuesto: repuesto
}

export interface VTV extends vtv {}

export interface Repuesto extends repuesto {
  tipo_repuesto: tipo_repuesto
}

export interface PedidoRepuesto extends pedido_repuesto {
  repuesto: repuesto & {
    tipo_repuesto: tipo_repuesto
  }
  proveedor: proveedor
}

export type LogisticaForms =
  | Vehiculo
  | KilometrajeVehiculo
  | ReparacionForm
  | VTV
  | Repuesto
  | PedidoRepuesto
  | proveedor
