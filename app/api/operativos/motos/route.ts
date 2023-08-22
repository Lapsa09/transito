import { NextResponse } from 'next/server'
import prisma from '@/lib/prismadb'

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

export async function GET() {
  const motos = await prisma.motos_registros.findMany({
    include: {
      operativo: { include: { localidad: true } },
      motivos: true,
      tipo_licencias: true,
      zona_infractor: true,
    },
  })

  return NextResponse.json(motos)
}

export async function POST(req: Request) {
  const body = await req.json()

  const data = { ...body, id_operativo: await operativoMotos(body) }

  const repetido = await prisma.motos_registros.findFirst({
    where: {
      dominio: data.dominio,
      id_operativo: data.id_operativo,
    },
  })

  if (repetido) {
    return NextResponse.json('El dominio ya fue ingresado el mismo dia', {
      status: 401,
    })
  }

  const moto = await prisma.motos_registros.create({
    data: {
      id_licencia: data.id_licencia,
      id_zona_infractor: data.zona_infractor.id_zona,
      acta: data.acta,
      dominio: data.dominio,
      fechacarga: new Date(),
      licencia: data.licencia,
      lpcarga: data.lpcarga,
      resolucion: data.resolucion,
      id_operativo: data.id_operativo,
      mes: new Date(data.fecha).getMonth() + 1,
      semana: Math.ceil(new Date(data.fecha).getDate() / 7),
      motivos: {
        createMany: {
          data: data.motivos.map((motivo: any) => ({
            id_motivo: motivo.id_motivo,
            id_operativo: data.id_operativo,
          })),
        },
      },
    },
    include: {
      operativo: {
        include: { localidad: { select: { barrio: true, cp: true } } },
      },
      motivos: true,
      tipo_licencias: true,
      zona_infractor: true,
    },
  })

  return NextResponse.json(
    JSON.parse(
      JSON.stringify(moto, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    )
  )
}
