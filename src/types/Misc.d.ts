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
  legajo: number
  nombre: string
  apellido: string
  telefono: number
  turno?: string
  rol?: Roles
  iat: number
}

export interface ITurnos {
  enumlabel: 'MAÑANA' | 'TARDE' | 'NOCHE'
}

export interface IResolucion {
  enumlabel: 'PREVENCION' | 'ACTA' | 'REMITIDO'
}

export interface ISeguridad {
  enumlabel: 'NO' | 'POLICIA' | 'PREFECTURA' | 'SECRETARIA DE SEGURIDAD'
}
