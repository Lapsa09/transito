import { NextRequest, NextResponse } from 'next/server'
import * as fs from 'fs'
import { revalidateTag } from 'next/cache'
import { db } from '@/drizzle'
import { movil } from '@/drizzle/schema/logistica'
import { eq } from 'drizzle-orm'

const decode = async (id: string, archivo: File) => {
  const LINKPATH = '/logistica/vehiculos/seguros'
  const FILEPATH = `public${LINKPATH}`
  const [, extension] = archivo.type.split('/')
  const bytes = await archivo?.arrayBuffer()
  const buffer = Buffer.from(bytes)
  if (!fs.existsSync(FILEPATH)) fs.mkdirSync(FILEPATH, { recursive: true })
  fs.writeFileSync(`${FILEPATH}/${id}.${extension}`, buffer, {
    encoding: 'base64',
  })

  return `${LINKPATH}/${id}.${extension}`
}

export async function POST(
  req: NextRequest,
  { params }: { params: { patente: string } },
) {
  const { patente } = params
  const formData = await req.formData()
  const seguro = formData.get('seguro') as File

  const link = await decode(patente, seguro)

  await db.update(movil).set({ seguro: link }).where(eq(movil.patente, patente))
  revalidateTag('vehiculos')
  return NextResponse.json('Exito')
}
