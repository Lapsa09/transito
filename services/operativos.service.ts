import { getter } from './main.service'
import { EditAutosProps, EditCamionesProps, EditMotosProps } from '@/types'
import { Registro as Auto } from '@/types/autos'
import { Registro as Camion } from '@/types/camiones'
import { Registro as Moto } from '@/types/motos'

export const getAutos = async () =>
  await getter<Auto[]>({ route: 'operativos/autos' })

export const getMotos = async () =>
  await getter<Moto[]>({ route: 'operativos/motos' })

export const getCamiones = async () =>
  await getter<Camion[]>({
    route: 'operativos/camiones',
  })

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
