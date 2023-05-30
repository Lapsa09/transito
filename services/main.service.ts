import { IZona } from '@/types'

type Props = {
  route: string
  tag: string
}

export const getter = async <T>({ route, tag }: Props) => {
  const res = await fetch(
    'https://transito.vicentelopez.gov.ar:3001/' + route,
    {
      next: { tags: [tag], revalidate: 60 },
    }
  )
  const data: T = await res.json()
  return data
}

export const getVicenteLopez = async () => {
  const data = await getter<IZona[]>({
    route: 'zonas/vl',
    tag: 'vicente-lopez',
  })
  return data
}
