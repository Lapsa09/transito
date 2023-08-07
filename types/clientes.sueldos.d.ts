import type {
  operario,
  operarios_servicios,
  servicios,
  clientes,
  recibos,
} from '@prisma/client'

export interface IOperario extends operarios_servicios {
  operarios: operario
}

export interface Servicio extends servicios {
  operarios_servicios: IOperario[]
  recibos: recibos | null
}

export interface Historial {
  acopio: number
  año?: number
  gastos: number
  mes?: number
  servicios: Servicio[]
}
export interface Cliente extends clientes {
  a_deudor: number
  a_favor: number
  historial: Historial[]
}
