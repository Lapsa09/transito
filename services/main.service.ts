import {
  barrios,
  motivos,
  resolucion,
  seguridad,
  tipo_licencias,
  turnos,
  vicente_lopez,
  zonas,
} from '@prisma/client'
import Axios from 'axios'

type Props = {
  route: string
  body?: any
}

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
})

export const getter = async <T = any>({ route }: Props) => {
  const { data } = await axios.get<T>(route)

  return data
}

export const setter = async <T = any>({ route, body }: Props) => {
  const { data } = await axios.post<T>(route, body)

  return data
}

export const updater = async <T = any>({ route, body }: Props) => {
  const { data } = await axios.put<T>(route, body)
  return data
}

export const getVicenteLopez = async () => {
  const data = await getter<vicente_lopez[]>({
    route: 'zonas/vl',
  })
  return data
}

export const getTurnos = async () => {
  const data = await getter<turnos[]>({
    route: 'turnos',
  })
  return data
}

export const getSeguridad = async () => {
  const data = await getter<seguridad[]>({
    route: 'seguridad',
  })
  return data
}

export const getLicencias = async () => {
  const data = await getter<tipo_licencias[]>({
    route: 'licencias',
  })
  return data
}

export const getResolucion = async () => {
  const data = await getter<resolucion[]>({
    route: 'resolucion',
  })
  return data
}

export const getAllZonas = async () => {
  const data = await getter<barrios[]>({
    route: 'zonas',
  })
  return data
}

export const getMotivos = async () => {
  const data = await getter<motivos[]>({
    route: 'motivos',
  })
  return data
}
export const getZonasPaseo = async () => {
  const data = await getter<zonas[]>({
    route: 'zonas/paseo',
  })
  return data
}

export const getSelects = async () => {
  const [
    zonas,
    turnos,
    seguridad,
    licencias,
    resolucion,
    motivos,
    vicenteLopez,
    zonasPaseo,
  ] = await Promise.all([
    getAllZonas(),
    getTurnos(),
    getSeguridad(),
    getLicencias(),
    getResolucion(),
    getMotivos(),
    getVicenteLopez(),
    getZonasPaseo(),
  ])
  return {
    zonas,
    turnos,
    seguridad,
    licencias,
    resolucion,
    motivos,
    vicenteLopez,
    zonasPaseo,
  }
}
