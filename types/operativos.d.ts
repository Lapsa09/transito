import { seguridad, turnos, vicente_lopez } from '@prisma/client'

export interface Operativo {
  direccion_full: string
  fecha: Date
  hora: Date
  id_op?: number
  latitud: number
  legajo_a_cargo?: string
  legajo_planilla?: string
  localidad: vicente_lopez
  longitud: number
  qth: string
  seguridad?: seguridad
  turno: turnos
  legajo?: string
}
