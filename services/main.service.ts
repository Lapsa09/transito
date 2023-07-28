import {
  IBarrio,
  ILicencias,
  IMotivos,
  IResolucion,
  ISeguridad,
  ITurnos,
  IZona,
} from '@/types'
import axios from 'axios'

type Props = {
  route: string
  body?: any
}

export const getter = async <T = any>({ route }: Props) => {
  const { data } = await axios.get<T>('http://localhost:3000/api/' + route)

  return data
}

export const setter = async <T = any>({ route, body }: Props) => {
  const { data } = await axios.post<T>(
    'http://localhost:3000/api/' + route,
    body
  )

  return data
}

export const updater = async <T = any>({ route, body }: Props) => {
  const { data } = await axios.put<T>(
    'http://localhost:3000/api/' + route,
    body
  )
  return data
}

export const getVicenteLopez = async () => {
  const data = await getter<IZona[]>({
    route: 'zonas/vl',
  })
  return data
}

export const getTurnos = async () => {
  const data = await getter<ITurnos[]>({
    route: 'turnos',
  })
  return data
}

export const getSeguridad = async () => {
  const data = await getter<ISeguridad[]>({
    route: 'seguridad',
  })
  return data
}

export const getLicencias = async () => {
  const data = await getter<ILicencias[]>({
    route: 'licencias',
  })
  return data
}

export const getResolucion = async () => {
  const data = await getter<IResolucion[]>({
    route: 'resolucion',
  })
  return data
}

export const getAllZonas = async () => {
  const data = await getter<IBarrio[]>({
    route: 'zonas',
  })
  return data
}

export const getMotivos = async () => {
  const data = await getter<IMotivos[]>({
    route: 'motivos',
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
  ] = await Promise.all([
    getAllZonas(),
    getTurnos(),
    getSeguridad(),
    getLicencias(),
    getResolucion(),
    getMotivos(),
    getVicenteLopez(),
  ])
  return {
    zonas,
    turnos,
    seguridad,
    licencias,
    resolucion,
    motivos,
    vicenteLopez,
  }
}
