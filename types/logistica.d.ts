import {
  Dependencia,
  Movil,
  Proveedor,
  Reparaciones,
  Repuestos,
  TipoRepuesto,
  TipoVehiculo,
  Uso,
} from '@/drizzle/schema/logistica'

export interface Vehiculo extends Movil {
  uso: Uso
  dependencia: Dependencia
  tipo_vehiculo: TipoVehiculo
  seguro?: string
}

export interface Reparacion extends Reparaciones {
  repuesto: Repuestos & {
    pedido_repuesto: PedidoRepuesto & {
      proveedor: Proveedor
    }
  }
  movil: Movil
}

export type ReparacionForm = Reparaciones & {
  repuesto: Repuestos
}

export interface Repuesto extends Repuestos {
  tipo_repuesto: TipoRepuesto
  reparacion?: Reparaciones
  pedido_repuesto?: PedidoRepuesto
}

export interface PedidoRepuesto extends PedidoRepuesto {
  repuestos: Array<Repuesto & { cantidad: number }>
  proveedor: Proveedor
}

export interface PedidoForm extends PedidoRepuesto {
  repuestos: {
    tipo_repuesto: TipoRepuesto
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
