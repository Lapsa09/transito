import Axios, { AxiosResponse } from 'axios'
import {
  IResolucion,
  ISeguridad,
  ITurnos,
  IBarrio,
  ILicencias,
  IMotivos,
  IZona,
} from '../types'

const abortController = new AbortController()

const axios = Axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  signal: abortController.signal,
})

export const abortFetch = () => abortController.abort()

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

export const getTurnos = async (): Promise<ITurnos[]> =>
  await getEnums<ITurnos[]>('turnos')

export const getResolucion = async (): Promise<IResolucion[]> =>
  await getEnums<IResolucion[]>('resolucion')

export const getLicencias = async (): Promise<ILicencias[]> =>
  await getter<ILicencias[]>('/licencias')

export const getZonasVL = async (): Promise<IZona[]> =>
  await getter<IZona[]>('/zonas/vl')

export const getAllZonas = async (): Promise<IBarrio[]> =>
  await getter<IBarrio[]>('/zonas')

export const getSeguridad = async (): Promise<ISeguridad[]> =>
  await getEnums<ISeguridad[]>('seguridad')

export const getMotivos = async (): Promise<IMotivos[]> =>
  await getter<IMotivos[]>('/motivos')
