import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prismadb'

// Limit the middleware to paths starting with `/api/`
export const config = {
  matcher: '/api/operativos/motos',
}

export async function middleware(request: NextRequest) {
  if (request.method === 'POST') {
    const body = await request.json()
    body.id_operativo = await operativoMotos(body)
    return NextResponse.next(body)
  }
  return NextResponse.next()
}
const operativoMotos = async (body: any) => {
  const {
    fecha,
    direccion,
    turno,
    legajo_a_cargo,
    legajo_planilla,
    zona,
    seguridad,
    hora,
  } = body

  try {
    const op = await prisma.motos_operativos.findFirst({
      where: {
        fecha,
        qth: direccion,
        turno,
        legajo_a_cargo,
        legajo_planilla,
        id_zona: zona.id_barrio,
        seguridad,
        hora,
        direccion_full: `${direccion}, ${zona.cp}, Vicente Lopez, Buenos Aires, Argentina`,
      },
      select: {
        id_op: true,
      },
    })

    if (!op) {
      const id_op = await prisma.motos_operativos.create({
        data: {
          fecha,
          qth: direccion,
          turno,
          legajo_a_cargo,
          legajo_planilla,
          id_zona: zona.id_barrio,
          seguridad,
          hora,
          direccion_full: `${direccion}, ${zona.cp}, Vicente Lopez, Buenos Aires, Argentina`,
        },
        select: {
          id_op: true,
        },
      })

      return id_op.id_op
    } else {
      return op.id_op
    }
  } catch (error) {
    console.log(error)
  }
}
