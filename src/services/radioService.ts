import {
  EstadoMovil,
  EstadoOperario,
  RadioMovilForm,
  RadioOPForm,
} from '../types'
import { getter, setter, updater } from './mains'

export const getOperariosRadio = async () =>
  await getter<RadioOPForm[]>('/radio/operarios')

export const getMovilesRadio = async () =>
  await getter<RadioMovilForm[]>('/radio/moviles')

export const postOperarioRadio = async (body) =>
  await setter<RadioOPForm>('/radio/operarios', body)

export const postMovilRadio = async (body) =>
  await setter<RadioMovilForm>('/radio/moviles', body)

export const editOperarioRadio = async (body) =>
  await updater<RadioOPForm>('/radio/operarios', body)

export const editMovilRadio = async (body) =>
  await updater<RadioMovilForm>('/radio/moviles', body)

export const getEstadoMovil = async () =>
  await getter<EstadoMovil[]>('/radio/moviles/estado')

export const getEstadoOperario = async () =>
  await getter<EstadoOperario[]>('/radio/operarios/estado')

export const getSingleMovil = async (id) =>
  await getter<RadioMovilForm>('/radio/moviles/' + id)

export const getSingleOperario = async (id) =>
  await getter<RadioOPForm>('/radio/operarios/' + id)
