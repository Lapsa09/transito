import {
  operario,
  operarios_servicios,
  servicios,
  clientes,
} from '@prisma/client'

export interface Operarios extends operarios_servicios {
  operario: operario
}

export interface Servicio extends servicios {
  cliente: clientes
  servicios: Operarios[]
}
