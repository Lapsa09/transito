import prisma from '@/lib/prismadb'
import { recibos } from '@prisma/client'
import { NextResponse } from 'next/server'

const liquidar = async () => {
  const recibos = await prisma.recibos.findMany({
    where: {
      clientes: {
        id_cliente: body.cliente.id_cliente,
      },
      acopio: {
        gt: 0,
      },
    },
    orderBy: {
      fecha_recibo: 'asc',
    },
  })

  if (recibos.length === 0) {
    return NextResponse.json('No hay suficiente dinero', {
      status: 400,
    })
  }

  let acumulado = 0
  let i = 0
  const recibosNecesarios: recibos[] = []
  while (acumulado < body.importe_servicio && i < recibos.length) {
    acumulado += recibos[i].acopio
    recibosNecesarios.push(recibos[i])
    i++
  }

  for (const operario of body.operarios) {
    if (recibosNecesarios[0].acopio >= operario.a_cobrar) {
      await prisma.operarios_servicios.create({
        data: {
          servicios: {
            connect: {
              id_servicio: nuevoServicio.id_servicio,
            },
          },
          operarios: {
            connect: {
              legajo: operario.operario?.legajo,
            },
          },
          hora_inicio: new Date(
            body.fecha_servicio + ' ' + operario.hora_inicio
          ),
          hora_fin: new Date(body.fecha_servicio + ' ' + operario.hora_fin),
          a_cobrar: operario.a_cobrar,
          cancelado: false,
          recibos: {
            connect: {
              recibo: recibosNecesarios[0].recibo,
            },
          },
        },
      })
      await prisma.recibos.update({
        where: {
          recibo: recibosNecesarios[0].recibo,
        },
        data: {
          acopio: recibosNecesarios[0].acopio - operario.a_cobrar,
        },
      })
      recibosNecesarios[0].acopio -= operario.a_cobrar
    } else {
      let cuantoFalta = operario.a_cobrar
      while (recibosNecesarios[0].acopio < cuantoFalta) {
        cuantoFalta -= recibosNecesarios[0].acopio
        await prisma.operarios_servicios.create({
          data: {
            servicios: {
              connect: {
                id_servicio: nuevoServicio.id_servicio,
              },
            },
            operarios: {
              connect: {
                legajo: operario.operario?.legajo,
              },
            },
            hora_inicio: new Date(
              body.fecha_servicio + ' ' + operario.hora_inicio
            ),
            hora_fin: new Date(body.fecha_servicio + ' ' + operario.hora_fin),
            a_cobrar: recibosNecesarios[0].acopio,
            recibos: {
              connect: {
                recibo: recibosNecesarios[0].recibo,
              },
            },
          },
        })
        await prisma.recibos.update({
          where: {
            recibo: recibosNecesarios[0].recibo,
          },
          data: {
            acopio: 0,
          },
        })
        recibosNecesarios.shift()
        if (recibosNecesarios.length === 0)
          return NextResponse.json('No hay suficiente dinero', { status: 403 })
      }
      if (cuantoFalta > 0) {
        await prisma.operarios_servicios.create({
          data: {
            servicios: {
              connect: {
                id_servicio: nuevoServicio.id_servicio,
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
            recibos: {
              connect: {
                recibo: recibosNecesarios[0].recibo,
              },
            },
          },
        })
        await prisma.recibos.update({
          where: {
            recibo: recibosNecesarios[0].recibo,
          },
          data: {
            acopio: recibosNecesarios[0].acopio - cuantoFalta,
          },
        })
        recibosNecesarios[0].acopio -= cuantoFalta
      }
    }
  }
}
