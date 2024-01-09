import { DateTime } from 'luxon'

export const setExpiration = () => {
  const now = DateTime.now()

  return now.plus({ hours: 8 }).toMillis()
}

export const parseToISOTime = (date: string) => {
  const res = DateTime.fromFormat(date, 'HH:mm')

  return res.minus({ hour: 3 }).toISO()
}

export function shuffle<T>(array: T[]) {
  const _array = [...array]
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return _array
}
