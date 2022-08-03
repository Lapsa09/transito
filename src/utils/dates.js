import { DateTime } from 'luxon'

export const dateFormat = (date) =>
  DateTime.fromISO(date, {
    zone: 'America/Argentina/Buenos_Aires',
  }).toFormat('dd/MM/yyyy')

export const timeFormat = (time) =>
  DateTime.fromISO(time, {
    zone: 'America/Argentina/Buenos_Aires',
  }).toFormat('HH:mm')

export const dateTimeFormat = (datetime) =>
  DateTime.fromISO(datetime, {
    zone: 'America/Argentina/Buenos_Aires',
  }).toFormat('dd/MM/yyyy HH:mm')

export const currentDate = () => DateTime.now().setLocale('es-AR')

export const dateTimeSQLFormat = (datetime) =>
  DateTime.fromSQL(datetime, {
    zone: 'America/Argentina/Buenos_Aires',
  }).toFormat('dd/MM/yyyy HH:mm')

export const dateNameFormat = (date) => {
  const dateObj = DateTime.fromISO(date, {
    zone: 'America/Argentina/Buenos_Aires',
  })

  return `${dateObj.weekdayLong} ${dateObj.toFormat('dd/MM')}`
}

export const mesName = {
  1: 'Enero',
  2: 'Febrero',
  3: 'Marzo',
  4: 'Abril',
  5: 'Mayo',
  6: 'Junio',
  7: 'Julio',
  8: 'Agosto',
  9: 'Septiembre',
  10: 'Octubre',
  11: 'Noviembre',
  12: 'Diciembre',
}
