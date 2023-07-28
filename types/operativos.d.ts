export interface Operativo {
  id: number
  fecha: string
  hora?: string
  legajo_planilla: number
  acta?: number
  resolucion?: string
  dominio: string
  turno: string
  fechacarga?: string
  lpcarga?: number
  motivo?: string
}

export interface OperativoAutos extends Operativo {
  qth: string
  barrio: string
  cp: string
  legajo_a_cargo: number
  seguridad: string
  licencia?: number
  tipo_licencia?: string
  tipo_vehiculo?: string
  zona_infractor: string
  motivo?: string
  graduacion_alcoholica?: number
  mes: number
  semana: number
  es_del?: string
  resultado?: string
}

export interface OperativoMotos extends Operativo {
  direccion: string
  zona: string
  cp: string
  legajo_a_cargo?: number
  seguridad: string
  licencia?: number
  tipo_licencia?: string
  motivos?: string[]
  zona_infractor?: string
}

export interface OperativoCamiones extends Operativo {
  direccion: string
  localidad?: string
  cp?: string
  origen?: string
  localidad_origen: string
  destino: string
  localidad_destino?: string
  licencia?: number
  remito: boolean
  carga: boolean
  hora_carga: string
  legajo_carga: string
}

export interface OperativoPaseo extends Operativo {
  zona: string
  barrio?: string
  lp?: number
  mes: number
}

export interface OperativoDiario extends Operativo {
  direccion: string
  barrio?: string
  otro_motivo?: string
}

export interface ILicencias {
  tipo: string
  vehiculo?: string
}

export interface IZona {
  id_barrio: number
  barrio: string
  cp: string
}

export interface IBarrio {
  barrio: string
}

export interface IMotivos {
  motivo: string
}

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

export interface Localidad {
  barrio: string | null
  cp: string | null
}

export interface Motivos {
  motivo: string | null
}

export interface ZonaInfractor {
  barrio: string | null
}