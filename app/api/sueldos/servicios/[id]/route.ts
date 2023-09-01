import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prismadb'
import { ServiciosFormProps } from '@/types'

export async function GET({ params }: { params: { id: string } }) {
  const servicios = await prisma.servicios.findFirst({
    where: {
      id_servicio: +params.id,
    },
    include: {
      clientes: { select: { cliente: true } },
      operarios_servicios: {
        include: {
          operarios: true,
        },
      },
    },
  })
  return NextResponse.json(servicios)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body: ServiciosFormProps = await req.json()
  const { operarios_servicios } = await prisma.servicios.update({
    where: {
      id_servicio: +params.id,
    },
    data: {
      clientes: {
        connect: {
          id_cliente: body.cliente.id_cliente,
        },
      },
      fecha_servicio: body.fecha_servicio,
      feriado: body.feriado,
      importe_servicio: body.importe_servicio,
      memo: body.memo,
    },
    select: {
      operarios_servicios: {
        include: {
          operarios: true,
        },
      },
    },
  })

  for (const operario of body.operarios) {
    const busca = operarios_servicios.find(
      (op) => op.legajo === operario.operario?.legajo
    )
    if (body.recibo) {
      await prisma.recibos.upsert({
        where: {
          recibo: body.recibo,
          acopio: body.acopio,
          importe_recibo: body.importe_recibo,
          fecha_recibo: body.fecha_recibo,
        },
        update: {
          acopio: body.acopio,
          importe_recibo: body.importe_recibo,
          fecha_recibo: body.fecha_recibo,
        },
        create: {
          recibo: body.recibo,
          fecha_recibo: body.fecha_recibo!,
          acopio: body.importe_recibo!,
          importe_recibo: body.importe_recibo!,
          clientes: {
            connect: {
              id_cliente: body.cliente.id_cliente,
            },
          },
        },
      })
    }
    if (busca) {
      await prisma.operarios_servicios.update({
        where: {
          id: +params.id,
          AND: [
            {
              id_servicio: +params.id,
            },
            {
              legajo: operario.operario?.legajo,
            },
          ],
        },
        data: {
          hora_inicio: operario.hora_inicio,
          hora_fin: operario.hora_fin,
          a_cobrar: operario.a_cobrar,
          cancelado: operario.cancelado,
        },
      })
      if (busca.a_cobrar !== operario.a_cobrar) {
        const recibo = await prisma.recibos.findFirst({
          where: {
            AND: [
              {
                id_cliente: body.cliente.id_cliente,
              },
              {
                acopio: {
                  gt: operario.a_cobrar,
                },
              },
            ],
          },
          orderBy: {
            fecha_recibo: 'asc',
          },
        })
        if (recibo) {
          await prisma.operarios_servicios.update({
            where: {
              id: +params.id,
              AND: [
                {
                  id_servicio: +params.id,
                },
                {
                  legajo: operario.operario?.legajo,
                },
              ],
            },
            data: {
              recibos: {
                connect: {
                  recibo: recibo.recibo,
                },
              },
            },
          })
          await prisma.recibos.update({
            where: {
              recibo: recibo.recibo,
            },
            data: {
              importe_recibo: recibo.importe_recibo! - operario.a_cobrar,
            },
          })
        } else
          return NextResponse.json('No hay dinero suficiente', { status: 403 })
      }
    } else {
      const recibos = await prisma.recibos.findMany({
        where: {
          AND: [
            {
              id_cliente: body.cliente.id_cliente,
            },
            {
              acopio: {
                gt: 0,
              },
            },
          ],
        },
        orderBy: {
          fecha_recibo: 'asc',
        },
      })
      const repoRecibos = [...recibos]
      let cuantoFalta = operario.a_cobrar
      if (repoRecibos.length > 0) {
        while (repoRecibos[0].acopio < cuantoFalta) {
          cuantoFalta -= repoRecibos[0].acopio
          await prisma.operarios_servicios.create({
            data: {
              servicios: {
                connect: {
                  id_servicio: +params.id,
                },
              },
              operarios: {
                connect: {
                  legajo: operario.operario?.legajo,
                },
              },
              hora_inicio: operario.hora_inicio,
              hora_fin: operario.hora_fin,
              a_cobrar: cuantoFalta,
              cancelado: operario.cancelado,
              recibos: {
                connect: {
                  recibo: repoRecibos[0].recibo,
                },
              },
            },
          })
          await prisma.recibos.update({
            where: {
              recibo: repoRecibos[0].recibo,
            },
            data: {
              acopio: 0,
            },
          })
          repoRecibos.shift()
        }
        if (cuantoFalta > 0) {
          await prisma.operarios_servicios.create({
            data: {
              servicios: {
                connect: {
                  id_servicio: +params.id,
                },
              },
              operarios: {
                connect: {
                  legajo: operario.operario?.legajo,
                },
              },
              hora_inicio: operario.hora_inicio,
              hora_fin: operario.hora_fin,
              a_cobrar: cuantoFalta,
              cancelado: operario.cancelado,
              recibos: {
                connect: {
                  recibo: repoRecibos[0].recibo,
                },
              },
            },
          })
          await prisma.recibos.update({
            where: {
              recibo: repoRecibos[0].recibo,
            },
            data: {
              acopio: repoRecibos[0].acopio - cuantoFalta,
            },
          })
        }
      } else
        return NextResponse.json('No hay dinero suficiente', { status: 403 })
    }
  }

  const servicio = await prisma.servicios.findFirst({
    where: {
      id_servicio: +params.id,
    },
    include: {
      clientes: { select: { cliente: true } },
      operarios_servicios: {
        include: {
          operarios: true,
        },
      },
    },
  })

  return NextResponse.json(servicio)
}
