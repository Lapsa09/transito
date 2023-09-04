import {
  operario,
  operarios_servicios,
  servicios,
  clientes,
} from '@prisma/client'

export interface Operarios extends operarios_servicios {
  operarios: operario
}

export interface Servicio extends servicios {
  clientes: clientes
  operarios_servicios: Operarios[]
}
