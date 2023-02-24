export interface OperativoAutos {
  fecha: string
  hora: string
  qth: string
  barrio: string
  cp: string
  legajo_a_cargo: number
  legajo_planilla: number
  turno?: string
  seguridad: string
  dominio: string
  licencia?: number
  tipo_licencia?: string
  tipo_vehiculo?: string
  zona_infractor: string
  acta?: number
  motivo?: string
  graduacion_alcoholica?: number
  resolucion?: string
  fechacarga?: string
  lpcarga?: number
  mes: number
  semana: number
  es_del?: string
  resultado?: string
  id: number
}

export interface OperativoMotos {
  id: number
  fecha: string
  hora: string
  direccion: string
  zona: string
  cp: string
  legajo_a_cargo?: number
  legajo_planilla: number
  turno: string
  seguridad: string
  dominio: string
  licencia?: number
  tipo_licencia?: string
  motivos?: string[]
  acta?: number
  resolucion?: string
  zona_infractor?: string
  fechacarga: string
  lpcarga: number
}

export interface OperativoCamiones {
  fecha: string
  hora?: string
  turno: string
  legajo: number
  direccion: string
  localidad?: string
  cp?: string
  dominio: string
  origen?: string
  localidad_origen: string
  destino: string
  localidad_destino?: string
  licencia?: number
  remito: boolean
  carga: boolean
  resolucion?: string
  acta?: number
  motivo?: string
  hora_carga: string
  legajo_carga: string
  id: number
}

export interface OperativoPaseo {
  id: number
  fecha: string
  hora: string
  zona: string
  barrio?: string
  dominio: string
  lp?: number
  acta?: number
  resolucion: string
  turno: string
  fechacarga: string
  lpcarga: number
  motivo: string
  mes: number
}

export interface OperativoDiario {
  id: number
  fecha: string
  hora?: string
  direccion: string
  barrio?: string
  dominio?: string
  legajo_planilla: number
  acta?: number
  resolucion?: string
  turno: string
  fechacarga?: string
  lpcarga?: number
  mes?: number
  motivo?: any
  otro_motivo?: string
}

export interface ILicencias {
  id_tipo: number
  tipo: string
  vehiculo?: string
}

export interface IZona {
  id_barrio: number
  barrio: string
  cp: string
}

export interface IMotivos {
  id_motivo: number
  motivo: string
}
