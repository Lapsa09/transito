import { getter } from './main.service'
import { EditAutosProps, EditCamionesProps, EditMotosProps } from '@/types'
import { AutosDTO } from '@/DTO/operativos/autos'
import { CamionesDTO } from '@/DTO/operativos/camiones'
import { MotosDTO } from '@/DTO/operativos/motos'
import { RioDTO } from '@/DTO/operativos/rio'

export const getAutos = async () =>
  await getter<AutosDTO[]>({ route: 'operativos/autos' })

export const getMotos = async () =>
  await getter<MotosDTO[]>({ route: 'operativos/motos' })

export const getCamiones = async () =>
  await getter<CamionesDTO[]>({
    route: 'operativos/camiones',
  })

export const getPaseo = async () => {
  return await getter<RioDTO[]>({
    route: 'operativos/rio',
  })
}

export const getSingleAuto = async (id: number) =>
  await getter<EditAutosProps>({
    route: `operativos/autos/${id}`,
  })

export const getSingleMoto = async (id: number) =>
  await getter<EditMotosProps>({
    route: `operativos/motos/${id}`,
  })

export const getSingleCamion = async (id: number) => {
  return await getter<EditCamionesProps>({
    route: `operativos/camiones/${id}`,
  })
}
