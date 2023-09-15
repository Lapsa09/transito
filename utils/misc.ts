import { DateTime } from 'luxon'

export const setExpiration = () => {
  const now = DateTime.now()

  return now.plus({ hours: 8 }).toMillis()
}

export const parseToISOTime = (date: string) => {
  const res = DateTime.fromFormat(date, 'HH:mm')

  return res.minus({ hour: 3 }).toISO()
}
