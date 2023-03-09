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
