import prisma from '@/lib/prismadb'
import { RootObject } from '@/types/baches'
import axios from 'axios'
import { NextResponse } from 'next/server'

export async function GET() {
  const baches = await prisma?.baches.findMany()

  return NextResponse.json(baches)
}

export async function POST() {
  const { data } = await axios.get<RootObject>(
    'https://www.waze.com/row-partnerhub-api/partners/19519566058/waze-feeds/03dc0f9f-50ce-4710-bd05-f25bdea1159f?format=1',
  )

  const baches = data.alerts.filter(
    (alert) => alert.subtype === 'HAZARD_ON_ROAD_POT_HOLE',
  )

  for (const bache of baches) {
    await prisma.baches.create({
      data: {
        latitud: bache.location.y,
        longitud: bache.location.x,
        qth: bache.street,
      },
    })
  }
  return NextResponse.json('Success')
}
