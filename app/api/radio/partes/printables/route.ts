import { printablePartesDTO } from '@/DTO/radio'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const filterParams: Record<string, string> =
    searchParams
      .get('filter')
      ?.split(',')
      ?.reduce((acc, curr) => {
        const [id, value] = curr.split('=')

        return { ...acc, [id]: value }
      }, {}) ?? {}
  const partes = await printablePartesDTO(filterParams)

  return NextResponse.json(partes)
}
