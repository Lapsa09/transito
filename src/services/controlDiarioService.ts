import {
  IMotivosPaseo,
  IZonasPaseo,
  OperativoDiario,
  OperativoPaseo,
} from '../types'
import { getEnums, getter, setter } from '.'

export const nuevoControl = async (body) =>
  await setter<OperativoDiario>('/control/diario', body)

export const nuevoControlPaseo = async (body) =>
  await setter<OperativoPaseo>('/control/paseo', body)

export const getMotivosPaseo = async () =>
  await getEnums<IMotivosPaseo[]>('motivo')

export const getControles = async () =>
  await getter<OperativoDiario[]>('/control/diario')

export const getControlesPaseo = async () =>
  await getter<OperativoPaseo[]>('/control/paseo')

export const getZonasPaseo = async () =>
  await getter<IZonasPaseo[]>('/control/paseo/zonas')

export const getDatosPaseo = async (filter = null) =>
  await setter('/control/paseo/data', filter)
