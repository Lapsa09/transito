import prisma from '@/lib/prismadb'
import { EditMotosProps } from '@/types'
import { NextResponse } from 'next/server'

export async function GET(req: Request, state: { params: { id: string } }) {
  const {
    params: { id },
  } = state

  const auto = await prisma.motos_registros.findUnique({
    where: { id: Number(id) },
    include: {
      motivos: true,
      operativo: { include: { localidad: true } },
      tipo_licencias: true,
      zona_infractor: true,
    },
  })

  if (auto) {
    const { operativo, ...rest } = auto

    const res = {
      ...rest,
      ...operativo,
      fecha: operativo?.fecha?.toISOString().split('T')[0],
      hora: operativo?.hora?.toLocaleTimeString(),
    }

    return NextResponse.json(
      JSON.parse(
        JSON.stringify(res, (_, value) =>
          typeof value === 'bigint' ? value.toString() : value,
        ),
      ),
    )
  }
  return NextResponse.json(null)
}

export async function PUT(req: Request, state: { params: { id: string } }) {
  const {
    params: { id },
  } = state

  const body: EditMotosProps = await req.json()

  const _hora = new Date(body.fecha)
  // @ts-ignore
  _hora.setUTCHours(...body.hora.split(':'))

  const moto = await prisma.motos_registros.update({
    where: { id: Number(id) },
    data: {
      acta: body.acta ? +body.acta : null,
      dominio: body.dominio,
      licencia: body.licencia ? +body.licencia : null,
      resolucion: body.resolucion,
      zona_infractor: {
        connect: {
          id_barrio: body.zona_infractor.id_barrio,
        },
      },
      motivos: {
        createMany: {
          data: body.motivos.map((motivo: any) => ({
            id_motivo: motivo.id_motivo,
            id_operativo: body.id_op,
          })),
        },
      },
      tipo_licencias: {
        connect: {
          id_tipo: body.tipo_licencia?.id_tipo,
        },
      },
      operativo: {
        update: {
          fecha: body.fecha,
          hora: _hora,
          legajo_a_cargo: +body.legajo_a_cargo,
          legajo_planilla: +body.legajo_planilla,
          qth: body.qth,
          seguridad: body.seguridad,
          turno: body.turno,
          localidad: {
            connect: {
              id_barrio: body.localidad.id_barrio,
            },
          },
        },
      },
    },
    include: {
      motivos: true,
      operativo: { include: { localidad: true } },
      tipo_licencias: true,
      zona_infractor: true,
    },
  })
  return NextResponse.json(
    JSON.parse(
      JSON.stringify(moto, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value,
      ),
    ),
  )
}
