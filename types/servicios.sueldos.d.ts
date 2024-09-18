import {
  Clientes,
  Operarios,
  OperariosServicios,
  Servicios,
  servicios,
} from '@/drizzle/schema/sueldos'

export interface OperariosDTO extends OperariosServicios {
  operarios: Operarios
}

export interface Servicio extends Servicios {
  clientes: Clientes
  cantidad_operarios: number
}
