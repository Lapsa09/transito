import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prismadb'
import * as fs from 'fs'

const LINKPATH = '/logistica/vehiculos/seguros'
const FILEPATH = 'public/logistica/vehiculos/seguros'

export async function POST(
  req: NextRequest,
  { params }: { params: { patente: string } },
) {
  const { patente } = params
  const formData = await req.formData()
  const seguro = formData.get('seguro') as File

  const [, extension] = seguro.type.split('/')

  await decode(patente, extension, seguro)

  const movil = await prisma.movil.update({
    where: {
      patente,
    },
    data: {
      seguro: `${LINKPATH}/${patente}.${extension}`,
    },
  })

  return NextResponse.json(movil)
}

const decode = async (id: string, extension: string, archivo: File) => {
  const bytes = await archivo?.arrayBuffer()
  const buffer = Buffer.from(bytes)
  if (!fs.existsSync(FILEPATH)) fs.mkdirSync(FILEPATH, { recursive: true })
  fs.writeFileSync(`${FILEPATH}/${id}.${extension}`, buffer, {
    encoding: 'base64',
  })
}
