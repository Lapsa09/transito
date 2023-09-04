import type {
  operario,
  operarios_servicios,
  servicios,
  clientes,
  recibos,
} from '@prisma/client'

export interface IOperario extends operarios_servicios {
  operarios: operario | null
}

export interface Servicio extends servicios {
  operarios_servicios: IOperario[]
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
