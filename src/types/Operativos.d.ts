export interface Operativo {
  id: number
  fecha: string
  hora?: string
  legajo_planilla: number
  acta?: number
  resolucion?: string
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
  dominio: string
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
  dominio: string
  licencia?: number
  tipo_licencia?: string
  motivos?: string[]
  zona_infractor?: string
}

export interface OperativoCamiones extends Operativo {
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
  acta?: number
  motivo?: string
  hora_carga: string
  legajo_carga: string
}

export interface OperativoPaseo extends Operativo {
  zona: string
  barrio?: string
  dominio: string
  lp?: number
  acta?: number
  motivo: string
  mes: number
}

export interface OperativoDiario extends Operativo {
  direccion: string
  barrio?: string
  dominio?: string
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

export interface IBarrio {
  id_barrio: number
  barrio: string
}

export interface IMotivos {
  id_motivo: number
  motivo: string
}

export interface IMotivosPaseo {
  enumlabel: 'ESTACIONAMIENTO' | 'VELOCIDAD'
}
