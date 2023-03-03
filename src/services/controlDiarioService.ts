import { OperativoDiario, OperativoPaseo } from '../types'
import { getEnums, getter, setter } from './index'

export const nuevoControl = async (body) =>
  await setter('/control/diario', body)

export const nuevoControlPaseo = async (body) =>
  await setter('/control/paseo', body)

export const getMotivosPaseo = async () => await getEnums('motivo')

export const getControles = async () =>
  await getter<OperativoDiario[]>('/control/diario')

export const getControlesPaseo = async () =>
  await getter<OperativoPaseo[]>('/control/paseo')

export const getZonasPaseo = async () => await getter('/control/paseo/zonas')

export const getDatosPaseo = async (filter = null) =>
  await setter('/control/paseo/data', filter)
