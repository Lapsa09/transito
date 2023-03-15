import { RadioMovilForm, RadioOPForm } from '../types'
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
