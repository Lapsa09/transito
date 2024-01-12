import {
  barrios,
  clientes,
  motivos,
  operario,
  resolucion,
  seguridad,
  tipo_licencias,
  vicente_lopez,
  motivo,
  zonas,
  turnos,
} from '@prisma/client'
import { Operativo } from './operativos'
import { type LogisticaForms } from './logistica'

export interface LocalOperativo extends Partial<Operativo> {
  expiresAt: number
}

export interface RegisterUserProps {
  legajo: number
  nombre: string
  apellido: string
  telefono: number
  password: string
  confirmPassword: string
}

export interface LoginUserProps {
  legajo: string
  password: string
}

export interface FormInputProps {
  legajo_a_cargo: string
  legajo_planilla: string
  seguridad: seguridad
  qth: string
  localidad: vicente_lopez
  fecha: string
  turno: turnos
  lpcarga: number
  hora: string
  dominio: string
  zona_infractor: barrios
  licencia?: string
  tipo_licencia?: tipo_licencias
  resolucion?: resolucion
  acta?: string
  extranjero?: boolean
}

export interface EditInputProps extends FormInputProps {
  id: number
  id_op: number
}

export interface FormAutosProps extends FormInputProps {
  graduacion_alcoholica?: string
  motivo?: motivos
}

export interface EditAutosProps extends EditInputProps {
  graduacion_alcoholica: string
  motivo?: motivos
}

export interface FormMotosProps extends FormInputProps {
  motivos: motivos[]
}

export interface EditMotosProps extends EditInputProps {
  motivos: motivos[]
}

export interface FormCamionesProps extends FormInputProps {
  motivo?: motivos
  remito: boolean
  carga: boolean
  legajo: number
  origen?: string
  destino?: string
  localidad_origen: barrios
  localidad_destino: barrios
}

export interface EditCamionesProps extends EditInputProps {
  motivo: motivos
  remito: boolean
  carga: boolean
  legajo: string
  origen?: string
  destino?: string
  localidad_origen: barrios
  localidad_destino: barrios
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
  cliente: clientes
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
  resolucion: resolucion
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
