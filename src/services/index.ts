import Axios, { AxiosResponse } from 'axios'
import { IResolucion, ISeguridad, ITurnos } from 'types'
import { IBarrio, ILicencias, IMotivos, IZona } from 'types/Operativos'

const axios = Axios.create({ baseURL: process.env.REACT_APP_BASE_URL })

export const getter = async <T = null>(route: string) => {
  const { data }: AxiosResponse = await axios.get<T>(route)
  return data
}

export const setter = async <T = null>(
  route: string,
  body = null,
  headers = null
) => {
  const { data }: AxiosResponse = await axios.post<T>(route, body, headers)
  return data
}

export const getEnums = async <T>(type: string) =>
  await getter<T>('/api/' + type)

export const getTurnos = async () => await getEnums<ITurnos[]>('turnos')

export const getResolucion = async () =>
  await getEnums<IResolucion[]>('resolucion')

export const getLicencias = async () => await getter<ILicencias[]>('/licencias')

export const getZonasVL = async () => await getter<IZona[]>('/zonas/vl')

export const getAllZonas = async () => await getter<IBarrio[]>('/zonas')

export const getSeguridad = async () =>
  await getEnums<ISeguridad[]>('seguridad')

export const getMotivos = async () => await getter<IMotivos[]>('/motivos')
