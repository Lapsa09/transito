import {
  barrios,
  motivos,
  resolucion,
  seguridad,
  turnos,
  vicente_lopez,
} from '@prisma/client'

export interface Operativo {
  direccion_full: string
  fecha: string
  hora: string
  id_op?: number
  latitud: number
  legajo_a_cargo?: string
  legajo_planilla?: string
  legajo?: string
  localidad: vicente_lopez
  longitud: number
  qth: string
  seguridad?: seguridad
  turno: 'MAÑANA' | 'TARDE' | 'NOCHE'
  legajo?: string
}

export interface Registro {
  acta: null | bigint
  direccion_full: string | null
  dominio: string | null
  es_del?: string | null
  fechacarga: Date | null
  graduacion_alcoholica?: null | string
  id: number | null
  id_licencia?: number | null
  id_motivo: number | null
  id_operativo: number | null
  id_zona_infractor?: number | null
  latitud: null | string
  licencia: null | bigint
  lpcarga: null | bigint
  mes: number | null
  motivo: motivos | null
  resolucion: resolucion | null
  resultado?: string | null
  semana: number | null
  tipo_licencia?: tipo_licencias | null
  zona_infractor?: barrios | null
  operativo: Operativo | null
  hora: Date | null
  origen?: string | null
  destino?: string | null
  remito?: boolean | null
  carga?: boolean | null
  hora_carga: Date | null
  id_localidad_origen?: number | null
  id_localidad_destino?: number | null
  localidad_destino?: barrios | null
  localidad_origen?: barrios | null
  motivos?: motivos[]
}
