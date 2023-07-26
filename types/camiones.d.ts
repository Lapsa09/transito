import { turnos_old } from '@prisma/client'
import { Localidad } from './autos'
import { IBarrio, IMotivos } from './operativos'

export type Operativo = {
  id_op: number
  fecha: Date | null
  turno: turnos_old | null
  legajo: string | null
  direccion: string | null
  id_localidad: number | null
  direccion_full: string | null
  latitud: string | null
  longitud: string | null
  localidad: Localidad | null
}

export type Registro = {
  id: number
  hora: Date | null
  dominio: string | null
  origen: string | null
  destino: string | null
  licencia: string | null
  remito: boolean | null
  carga: boolean | null
  resolucion: string | null
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
  localidad_destino: IBarrio | null
  localidad_origen: IBarrio | null
  motivo: IMotivos | null
  operativo: Operativo | null
}
