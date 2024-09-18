import {
  Servicios,
  Operarios as IOperarios,
  OperariosServicios,
  Clientes,
} from '@/drizzle/schema/sueldos'

export interface Operario extends IOperarios {
  servicios: Operarios[]
}

export interface Operarios extends OperariosServicios {
  servicios: Servicio
}

export interface Servicio extends Servicios {
  clientes: Clientes
}
