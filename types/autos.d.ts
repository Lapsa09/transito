export enum Seguridad {
  No = 'NO',
  Policia = 'POLICIA',
  Prefectura = 'PREFECTURA',
  SecretariaDeSeguridad = 'SECRETARIA DE SEGURIDAD',
}

export enum Turno {
  MaAna = 'MAÑANA',
  Noche = 'NOCHE',
  Tarde = 'TARDE',
}

export interface Operativos {
  direccion_full: string | null
  fecha: Date | null
  hora: Date | null
  id_localidad: number | null
  id_op: number | null
  latitud: number | null
  legajo_a_cargo: bigint | null
  legajo_planilla: bigint | null
  localidad: Localidad | null
  longitud: number | null
  qth: string | null
  seguridad: string | null
  turno: string | null
}

export interface Localidad {
  barrio: string | null
  cp: string | null
}

export interface Registro {
  acta: null | bigint
  direccion_full: string | null
  dominio: string | null
  es_del: string | null
  fechacarga: Date | null
  graduacion_alcoholica: null | string
  id: number | null
  id_licencia: number | null
  id_motivo: number | null
  id_operativo: number | null
  id_zona_infractor: number | null
  latitud: null | string
  licencia: null | bigint
  longitud: null | string
  lpcarga: null | bigint
  mes: number | null
  motivos: Motivos | null
  resolucion: string | null
  resultado: string | null
  semana: number | null
  tipo_licencia: { tipo: string | null; vehiculo: string | null } | null
  zona_infractor: ZonaInfractor | null
  operativo: Operativos | null
}
export interface Motivos {
  motivo: string | null
}

export interface ZonaInfractor {
  barrio: string | null
}
