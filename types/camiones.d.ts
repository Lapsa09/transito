import type {
  barrios,
  motivos,
  resolucion,
  turnos,
  vicente_lopez,
} from '@prisma/client'

export type Operativo = {
  id_op: number
  fecha: string
  turno: turnos | null
  legajo: string | null
  direccion: string | null
  id_localidad: number | null
  direccion_full: string | null
  latitud: string | null
  longitud: string | null
  localidad: vicente_lopez | null
}

export type Registro = {
  id: number
  hora: string
  dominio: string | null
  origen: string | null
  destino: string | null
  licencia: string | null
  remito: boolean | null
  carga: boolean | null
  resolucion: resolucion | null
  acta: string | null
  hora_carga: Date | null
  legajo_carga: number | null
  mes: number | null
  semana: number | null
  direccion_full: string | null
  latitud: string | null
  longitud: string | null
  id_localidad_origen: number | null
  id_localidad_destino: number | null
  id_motivo: number | null
  id_operativo: number | null
  localidad_destino: barrios | null
  localidad_origen: barrios | null
  motivo: motivos | null
  operativo: Operativo
}
