import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prismadb'

export async function GET(req: NextRequest) {
  try {
    const mes = req.nextUrl.searchParams.get('mes')!
    const año = req.nextUrl.searchParams.get('año')!
    const minDate = new Date(`${año}-${mes}-01`)
    const maxDate = new Date(`${año}-${mes}-31`)

    if (maxDate.getMonth() !== +mes) {
      maxDate.setDate(maxDate.getDate() - 1)
    }

    const servicios = await prisma.servicios.findMany({
      where: {
        fecha_servicio: {
          gte: minDate,
          lte: maxDate,
        },
      },
      include: {
        clientes: {
          include: {
            recibos: {
              orderBy: {
                fecha_recibo: 'asc',
              },
            },
          },
        },
        operarios_servicios: {
          include: {
            operarios: true,
          },
        },
      },
    })

    for (const servicio of servicios) {
      const { recibos } = servicio.clientes!
      const operarios = []
      let i = 0
      for (const operario of servicio.operarios_servicios) {
        if (recibos[i].acopio >= operario.a_cobrar!) {
          operario.recibo = recibos[i].recibo
          recibos[i].acopio -= operario.a_cobrar!
          operarios.push(operario)
        } else {
          let cuantoFalta = operario.a_cobrar!
          while (recibos[i].acopio < cuantoFalta && i < recibos.length) {
            cuantoFalta -= recibos[i].acopio
            const _operario = { ...operario }
            _operario.recibo = recibos[i].recibo
            _operario.a_cobrar = recibos[i].acopio
            recibos[i].acopio = 0
            operarios.push(_operario)
            i++
          }
          if (cuantoFalta > 0) {
            operario.recibo = recibos[i].recibo
            operario.a_cobrar = cuantoFalta
            recibos[i].acopio -= cuantoFalta
            operarios.push(operario)
          }
        }
      }
      servicio.operarios_servicios = operarios
    }
    const arr = servicios.reduce<any[]>((acc, row) => {
      const busca = acc.find((a) => a.id_servicio === row.id_servicio)
      if (busca) {
        busca.servicios ??= []
        row.operarios_servicios.forEach((op) => {
          const recibo = row.clientes?.recibos.find(
            (r) => r.recibo === op.recibo
          )
          busca.servicios.push({
            id_servicio: row.id_servicio,
            memo: row.memo,
            recibo: op.recibo,
            fecha_recibo: recibo?.fecha_recibo,
            importe_recibo: recibo?.importe_recibo,
            importe_servicio: row.importe_servicio,
            acopio: recibo?.acopio,
            legajo: op.operarios?.legajo,
            nombre: op.operarios?.nombre,
            a_cobrar: op.a_cobrar,
            cancelado: op.cancelado,
          })
        })
        return acc
      } else {
        const obj = {
          id_servicio: row.id_servicio,
          mes: row.fecha_servicio!.getMonth() + 1,
          año: row.fecha_servicio!.getFullYear(),
          servicios: row.operarios_servicios.map((op) => {
            const recibo = row.clientes?.recibos.find(
              (r) => r.recibo === op.recibo
            )
            return {
              id_servicio: row.id_servicio,
              memo: row.memo,
              recibo: op.recibo,
              fecha_recibo: recibo?.fecha_recibo,
              importe_recibo: recibo?.importe_recibo,
              importe_servicio: row.importe_servicio,
              acopio: recibo?.acopio,
              legajo: op.operarios?.legajo,
              nombre: op.operarios?.nombre,
              a_cobrar: op.a_cobrar,
              cancelado: op.cancelado,
            }
          }),
        }

        return acc.concat(obj)
      }
    }, [])

    return NextResponse.json(arr)
  } catch (error: any) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
