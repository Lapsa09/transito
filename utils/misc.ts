import { DateTime } from 'luxon'

export const setExpiration = () => {
  const now = DateTime.now()

  return now.plus({ hours: 8 }).toMillis()
}

export const parseToISOTime = (date: string) => {
  const res = DateTime.fromFormat(date, 'HH:mm').toUTC()

  return res.toISO()
}

export function shuffle<T>(array: T[]) {
  const _array = [...array]
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return _array
}

export function generatePassword() {
  var length = 7,
    charset = 'abcdefghijklmnopqrstuvwxyz0123456789',
    retVal = ''
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n))
  }
  return retVal
}

export function splitFullName(fullName: string) {
  const palabras = fullName.split(' ')
  const SEPARACION = palabras.length - palabras.length / 2
  const grupos = []
  for (let i = 0; i < palabras.length; i += SEPARACION) {
    const grupo = palabras.slice(i, i + SEPARACION).join(' ')
    grupos.push(grupo)
  }
  return [grupos[0].toUpperCase(), grupos[1].toUpperCase()]
}

export function excelDateToJSDate(serial: number) {
  const utc_days = Math.floor(serial - 25569)
  const utc_value = utc_days * 86400
  const date_info = new Date(utc_value * 1000)

  const fractional_day = serial - Math.floor(serial) + 0.0000001

  let total_seconds = Math.floor(86400 * fractional_day)

  const seconds = total_seconds % 60

  total_seconds -= seconds
  const hours = Math.floor(total_seconds / (60 * 60))
  const minutes = Math.floor(total_seconds / 60) % 60
  date_info.setUTCHours(hours, minutes, seconds)
  return DateTime.fromJSDate(date_info).toUTC()
}
