import {
  AutosMetrics,
  CamionesMetrics,
  CitymisMetrics,
  GeneralMetrics,
  MotosMetrics,
} from '@/DTO/operativos/metrics'
import { getter } from './main.service'

export const getData = async () => {
  const data = await getter<GeneralMetrics>({ route: '/operativos/metrics' })

  return data
}

export const getCitymis = async () => {
  const data = await getter<CitymisMetrics>({
    route: '/operativos/metrics/citymis',
  })

  return data
}

export const getAutosData = async (query?: any) => {
  const searchParams = new URLSearchParams(query)
  const data = await getter<AutosMetrics>({
    route: '/operativos/autos/metrics' + '?' + searchParams.toString(),
  })

  return data
}

export const getMotosData = async () => {
  const data = await getter<MotosMetrics>({
    route: '/operativos/motos/metrics',
  })

  return data
}

export const getCamionesData = async () => {
  const data = await getter<CamionesMetrics>({
    route: '/operativos/camiones/metrics',
  })

  return data
}
