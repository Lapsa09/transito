import { getter } from './main.service'
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
