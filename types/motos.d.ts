import {
  resolucion,
  turnos_old,
  seguridad,
  tipo_licencias,
  barrios,
  motivos,
  vicente_lopez,
  moto_motivo,
} from '@prisma/client'

export type Registro = {
  dominio: string | null
  licencia: number | null
  acta: number | null
  resolucion: resolucion | null
  fechacarga: Date | null
  lpcarga: number | null
  mes: number | null
  semana: number | null
  id: number
  direccion_full: string | null
  latitud: string | null
  longitud: string | null
  id_licencia: number | null
  id_zona_infractor: number | null
  id_operativo: number | null
  motivos: Array<moto_motivo & { motivo: motivos }>
  tipo_licencias: tipo_licencias | null
  zona_infractor: barrios | null
  operativo: Operativo
}

export type Operativo = {
  id_op: number
  fecha: string
  hora: string
  qth: string | null
  legajo_a_cargo: number | null
  legajo_planilla: number | null
  turno: turnos_old | null
  seguridad: seguridad | null
  id_zona: number | null
  direccion_full: string | null
  latitud: string | null
  longitud: string | null
  localidad: vicente_lopez | null
}
