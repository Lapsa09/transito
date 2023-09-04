import {
  operario,
  operarios_servicios,
  servicios,
  clientes,
} from '@prisma/client'

export interface Operario extends operario {
  servicios: Operarios[]
}

export interface Operarios extends operarios_servicios {
  servicios: Servicio
}

export interface Servicio extends servicios {
  clientes: clientes
}
