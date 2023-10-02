import {
  dependencia,
  kilometraje_vehiculos,
  logistica_tipo_vehiculo,
  movil,
  proveedor,
  reparaciones,
  sector,
  pedido_repuesto,
  repuesto,
  vtv,
  tipo_repuesto,
} from '@prisma/client'

export interface Vehiculo extends movil {
  sector: sector
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
  | Reparacion
  | VTV
  | Repuesto
  | PedidoRepuesto
