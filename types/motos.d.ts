import { resolucion, turnos_old, seguridad } from '@prisma/client'
import { IBarrio, ILicencias, IMotivos, Localidad } from './operativos'

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
  motivos: IMotivos[]
  tipo_licencias: ILicencias | null
  barrio: IBarrio | null
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
  localidad: Localidad | null
}
