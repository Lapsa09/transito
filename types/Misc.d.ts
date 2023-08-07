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
  id: string
  legajo?: number
  nombre: string
  apellido: string
  user_password: string
  telefono: number
  role: Roles
  turno: ITurnos | null
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
  link: string
  name: string
  permission?: Roles
  links?: Links[]
}

export enum Meses {
  1 = 'ENERO',
  2 = 'FEBRERO',
  3 = 'MARZO',
  4 = 'ABRIL',
  5 = 'MAYO',
  6 = 'JUNIO',
  7 = 'JULIO',
  8 = 'AGOSTO',
  9 = 'SEPTIEMBRE',
  10 = 'OCTUBRE',
  11 = 'NOVIEMBRE',
  12 = 'DICIEMBRE',
}
