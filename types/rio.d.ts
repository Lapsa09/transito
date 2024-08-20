import { Barrio, Resolucion, Turno } from '@/drizzle/schema/schema'

export interface Operativo {
  id_op: number
  fecha: string
  lp: string
  turno: Turno
}

export interface Registro {
  id: number
  hora: string
  dominio: string
  acta: bigint
  resolucion: Resolucion
  fechacarga: string
  lpcarga: string
  mes: number
  barrio: Barrio
  operativo: Operativo
  zona: zonas
}
