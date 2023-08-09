import {
  resolucion,
  turnos_old,
  seguridad,
  tipo_licencias,
  barrios,
  motivos,
  vicente_lopez,
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
  motivos: motivos[]
  tipo_licencias: tipo_licencias | null
  barrio: barrios | null
  operativo: Operativo | null
}

export type Operativo = {
  id_op: number
  fecha: Date | null
  hora: Date | null
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
