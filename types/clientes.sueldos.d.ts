import {
  Clientes,
  OperariosServicios,
  Servicios,
} from '@/drizzle/schema/sueldos'
import { Operario } from './operarios.sueldos'

export interface IOperario extends OperariosServicios {
  operarios: Operario | null
}

export interface Servicio extends Servicios {
  operarios_servicios: IOperario[]
}

export interface Historial {
  acopio: number
  año?: number
  gastos: number
  mes?: number
  servicios: Servicio[]
}
export interface Cliente extends Clientes {
  a_deudor: number
  a_favor: number
  historial: Historial[]
}
