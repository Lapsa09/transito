export interface FormProps {
  handleClose: () => void | ((to: To) => void)
  afterCreate: (_data: any) => void
}

export enum Roles {
  ADMIN = 'ADMIN',
  INSPECTOR = 'INSPECTOR',
  ADMINISTRATIVO = 'ADMINISTRATIVO',
  WAZE = 'TRAFICO',
}

export type User = {
  id?: string | null | undefined
  legajo?: number
  nombre: string
  apellido: string
  user_password?: string
  telefono: number
  op: {
    permisos: {
      permiso: Roles
      id_permiso: number
    }
    turno: ITurnos | null
  }
}

export interface Enums {
  enumlabel: string
}

export enum ITurnos {
  'MAÑANA',
  'TARDE',
  'NOCHE',
}

export interface IResolucion extends Enums {
  enumlabel: 'PREVENCION' | 'ACTA' | 'REMITIDO'
}

export interface ISeguridad extends Enums {
  enumlabel: 'NO' | 'POLICIA' | 'PREFECTURA' | 'SECRETARIA DE SEGURIDAD'
}

export interface IMotivosPaseo extends Enums {
  enumlabel: 'VELOCIDAD' | 'ESTACIONAMIENTO'
}

export enum IResultado {
  'NO PUNITIVA',
  'PUNITIVA',
  'NEGATIVA',
}

export interface IZonasPaseo {
  id_zona: number
  zona: string
}

export interface Links {
  link?: string
  name: string
  permission?: Roles
  links?: Links[]
}

export enum Meses {
  JANUARY = 'ENERO',
  FEBRUARY = 'FEBRERO',
  MARCH = 'MARZO',
  APRIL = 'ABRIL',
  MAY = 'MAYO',
  JUNE = 'JUNIO',
  JULY = 'JULIO',
  AUGUST = 'AGOSTO',
  SEPTEMBER = 'SEPTIEMBRE',
  OCTOBER = 'OCTUBRE',
  NOVEMBER = 'NOVIEMBRE',
  DECEMBER = 'DICIEMBRE',
}
