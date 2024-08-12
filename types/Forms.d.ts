import { Operativo } from './operativos'
import { type LogisticaForms } from './logistica'
import {
  Barrio,
  Motivo,
  resolucionSchema,
  seguridadSchema,
  TipoLicencia,
  turnosSchema,
  VicenteLopez,
} from '@/drizzle/schema/schema'

export interface LocalOperativo extends Partial<Operativo> {
  expiresAt: number
}

export interface RegisterUserProps {
  legajo: number
  password: string
  confirmPassword: string
}

export interface LoginUserProps {
  legajo?: string
  password?: string
  dni?: string
}

export interface FormInputProps {
  legajo_a_cargo: string
  legajo_planilla: string
  seguridad: keyof typeof seguridadSchema.enum
  qth: string
  localidad: VicenteLopez
  fecha: string
  turno: keyof typeof turnosSchema.enum
  lpcarga: number
  hora: string
  dominio: string
  zona_infractor: Barrio
  licencia?: string
  tipo_licencia?: TipoLicencia
  resolucion?: keyof typeof resolucionSchema.enum
  acta?: string
  extranjero?: boolean
}

export interface EditInputProps extends FormInputProps {
  id: number
  id_op: number
}

export interface FormAutosProps extends FormInputProps {
  graduacion_alcoholica?: string
  motivo?: Motivo
}

export interface EditAutosProps extends EditInputProps {
  graduacion_alcoholica: string
  motivo?: Motivo
}

export interface FormMotosProps extends FormInputProps {
  motivos: Motivo[]
}

export interface EditMotosProps extends EditInputProps {
  motivos: Motivo[]
}

export interface FormCamionesProps extends FormInputProps {
  motivo?: Motivo
  remito: boolean
  carga: boolean
  legajo: number
  origen?: string
  destino?: string
  localidad_origen: Barrio
  localidad_destino: Barrio
}

export interface EditCamionesProps extends EditInputProps {
  motivo: motivos
  remito: boolean
  carga: boolean
  legajo: string
  origen?: string
  destino?: string
  localidad_origen: Barrio
  localidad_destino: Barrio
}

export type RadioOPForm = {
  id: number
  legajo: number
  nombre: string
  ht: string
  puntaje: number
  asistencia: boolean
  estado: string
  movil: number
  qth: string
  novedades?: string
}

export type RadioMovilForm = {
  movil: number
  estado: string
  novedades?: string
}

export type EstadoMovil = {
  id_estado: number
  estado: string
}

export type EstadoOperario = {
  id_estado: number
  estado: string
}

export type ServiciosFormProps = {
  cliente: clientes & { acopio: number }
  hay_recibo: boolean
  recibo?: number
  fecha_recibo?: string
  importe_recibo?: number
  acopio: number
  fecha_servicio: string
  feriado?: boolean
  memo?: string
  operarios: {
    operario?: operario
    hora_inicio: string
    hora_fin: string
    a_cobrar: number
    cancelado: boolean
  }[]
  importe_servicio: number
}

export type RioFormProps = {
  fecha: string
  motivo: motivo
  lp: string
  turno: turnos
  hora: string
  dominio: string
  acta: bigint
  resolucion: keyof typeof resolucionSchema.enum
  fechacarga: string
  lpcarga: string
  zona: zonas
  extranjero?: boolean
}

export type FormProps = FormInputProps &
  EditInputProps &
  ServiciosFormProps &
  RioFormProps &
  LogisticaForms
