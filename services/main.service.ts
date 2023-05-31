import {
  IBarrio,
  ILicencias,
  IMotivos,
  IResolucion,
  ISeguridad,
  ITurnos,
  IZona,
} from '@/types'

type Props = {
  route: string
  tag: string
}

export const getter = async <T>({ route, tag }: Props) => {
  const res = await fetch(
    'https://transito.vicentelopez.gov.ar:3001/' + route,
    {
      next: { tags: [tag], revalidate: 60 },
    }
  )
  const data: T = await res.json()
  return data
}

export const getVicenteLopez = async () => {
  const data = await getter<IZona[]>({
    route: 'zonas/vl',
    tag: 'vicente-lopez',
  })
  return data
}

export const getTurnos = async () => {
  const data = await getter<ITurnos[]>({
    route: 'api/turnos',
    tag: 'turnos',
  })
  return data
}

export const getSeguridad = async () => {
  const data = await getter<ISeguridad[]>({
    route: 'api/seguridad',
    tag: 'seguridad',
  })
  return data
}

export const getLicencias = async () => {
  const data = await getter<ILicencias[]>({
    route: 'licencias',
    tag: 'licencias',
  })
  return data
}

export const getResolucion = async () => {
  const data = await getter<IResolucion[]>({
    route: 'api/resolucion',
    tag: 'resolucion',
  })
  return data
}

export const getAllZonas = async () => {
  const data = await getter<IBarrio[]>({
    route: '/zonas',
    tag: 'zonas',
  })
  return data
}

export const getMotivos = async () => {
  const data = await getter<IMotivos[]>({
    route: '/motivos',
    tag: 'motivos',
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
