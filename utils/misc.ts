import { DateTime } from 'luxon'

//set expiration date at 8 hours from now
export const setExpiration = () => {
  const now = new Date()
  return now.setHours(now.getHours() + 8)
}

export const parseToISOTime = (date: string) => {
  const res = DateTime.fromFormat(date, 'HH:mm')

  return res.minus({ hour: 3 }).toISO()
}
