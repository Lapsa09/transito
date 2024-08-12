import { getter } from './main.service'
import { EditAutosProps, EditCamionesProps, EditMotosProps } from '@/types'
import { Registro as Moto } from '@/types/motos'
import { Registro as Paseo } from '@/types/rio'
import { AutosDTO } from '@/DTO/autos'
import { CamionesDTO } from '@/DTO/camiones'

export const getAutos = async () =>
  await getter<AutosDTO[]>({ route: 'operativos/autos' })

export const getMotos = async () =>
  await getter<Moto[]>({ route: 'operativos/motos' })

export const getCamiones = async () =>
  await getter<CamionesDTO[]>({
    route: 'operativos/camiones',
  })

export const getPaseo = async () => {
  return await getter<Paseo[]>({
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
