import { NextResponse, NextRequest } from 'next/server'
import { db } from '@/drizzle'
import { servicios } from '@/drizzle/schema/sueldos'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

export async function PUT(req: NextRequest, state: { params: { id: string } }) {
  const { memo } = await req.json()
  const id = z.coerce.number().parse(state.params.id)

  await db
    .update(servicios)
    .set({
      memo,
    })
    .where(eq(servicios.idServicio, id))

  return NextResponse.json('Exito')
}
