import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prismadb'

// Limit the middleware to paths starting with `/api/`
export const config = {
  matcher: '/api/operativos/autos',
}

export async function middleware(request: NextRequest) {
  if (request.method === 'POST') {
    const body = await request.json()
    body.es_del = await es_del(body.id_zona_infractor)
    body.resultado = alcoholemia(body.graduacion_alcoholica)
    body.id_operativo = await operativoAlcoholemia(body)
  }
  return NextResponse.next()
}

const es_del = async (id_zona_infractor: number) => {
  try {
    await prisma.vicente_lopez.findFirstOrThrow({
      select: { barrio: true },
      where: { id_barrio: id_zona_infractor },
    })
    return 'VILO'
  } catch (error) {
    return 'FUERA DEL MUNICIPIO'
  }
}

const alcoholemia = (graduacion_alcoholica: number) => {
  if (graduacion_alcoholica == 0 || !graduacion_alcoholica) return 'NEGATIVA'
  else if (graduacion_alcoholica > 0.05 && graduacion_alcoholica < 0.5)
    return 'NO PUNITIVA'
  else return 'PUNITIVA'
}

const operativoAlcoholemia = async (body: any) => {
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
    const op = await prisma.operativos_operativos.findFirst({
      where: {
        fecha,
        qth: direccion,
        turno,
        legajo_a_cargo,
        legajo_planilla,
        id_localidad: zona.id_barrio,
        seguridad,
        hora,
        direccion_full: `${direccion}, ${zona.cp}, Vicente Lopez, Buenos Aires, Argentina`,
      },
    })

    if (op == null) {
      const id_op = await prisma.operativos_operativos.create({
        data: {
          fecha,
          qth: direccion,
          turno,
          legajo_a_cargo,
          legajo_planilla,
          id_localidad: zona.id_barrio,
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
