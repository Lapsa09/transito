export interface Mes {
  id: number
  name: string
}

export interface IOperario {
  id: number
  cliente: string
  memo?: string
  fecha_servicio: string
  legajo: number
  nombre?: any
  a_cobrar: number
  cancelado?: boolean
  hora_inicio?: string
  hora_fin?: string
}

export interface IServicio {
  id: number
  memo?: string
  fecha_servicio: string
  cliente: string
  hora_inicio?: number | string
  hora_fin?: number | string
  operarios: IOperario[]
}

export interface Historial {
  acopio: number
  año: number
  cliente: string
  gastos: number
  id: number
  id_cliente: number
  id_servicio: number
  mes: Mes
  servicios: IServicio[]
}

export interface Cliente {
  a_deudor: number
  a_favor: number
  cliente: string
  historial: Historial[]
  id: number
  id_cliente: number
}
