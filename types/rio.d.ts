import { barrios, motivo, resolucion, turnos, zonas } from '@prisma/client'

export interface Operativo {
  id_op: number
  fecha: string
  motivo?: motivo
  lp: string
  turno: turnos
}

export interface Registro {
  id: number
  hora: string
  dominio: string
  acta: bigint
  resolucion: resolucion
  fechacarga: string
  lpcarga: string
  mes: number
  barrio: barrios
  operativo: Operativo
  zona: zonas
}
