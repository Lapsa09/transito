import Axios, { AxiosResponse } from 'axios'

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

export const getTurnos = async () => await getEnums('turnos')

export const getResolucion = async () => await getEnums('resolucion')
