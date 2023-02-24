import axios, { AxiosResponse } from 'axios'

const BASE_URL = process.env.REACT_APP_BASE_URL

export const getter = async (route: string) => {
  const { data }: AxiosResponse = await axios.get(BASE_URL + route)
  return data
}

export const setter = async (route: string, body = null, headers = null) => {
  const { data }: AxiosResponse = await axios.post(
    BASE_URL + route,
    body,
    headers
  )
  return data
}

export const getEnums = async (type: string) => await getter('/api/' + type)

export const getTurnos = async () => await getEnums('turnos')

export const getResolucion = async () => await getEnums('resolucion')
