import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sueldosdb } from '@/drizzle'
import { and, desc, gte, lte, sql } from 'drizzle-orm'

const searchParamsSchema = z.object({
  mes: z.coerce.number(),
  año: z.coerce.number(),
})

// {
//   id_servicio: number
//   mes: number
//   año: number
//   servicios: {
//     id_servicio: number | null
//     memo: string | null
//     recibo: number | null
//     fecha_recibo?: string
//     importe_recibo?: number
//     importe_servicio: number | null
//     acopio?: number
//     legajo?: number
//     nombre?: string | null
//     a_cobrar: number
//     cancelado: boolean | null
//   }[]
// }

//create a zod schema for the response
const responseSchema = z.array(
  z.object({
    id_servicio: z.number(),
    mes: z.number(),
    año: z.number(),
    servicios: z.array(
      z.object({
        id_servicio: z.number().nullable(),
        memo: z.string().nullable(),
        recibo: z.number().nullable(),
        fecha_recibo: z.string().optional(),
        importe_recibo: z.number().optional(),
        importe_servicio: z.number().nullable(),
        acopio: z.number().optional(),
        legajo: z.number().optional(),
        nombre: z.string().nullish(),
        a_cobrar: z.number().nullable(),
        cancelado: z.boolean().nullable(),
      }),
    ),
  }),
)

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const { mes, año } = searchParamsSchema.parse(searchParams)

    const minDate = sql<Date>`to_date(${`${año}-${mes}-01`}, 'YYYY-MM-DD')`
    const maxDate = sql<Date>`to_date(${`${año}-${mes}-31`}, 'YYYY-MM-DD')`

    const _servicios = await sueldosdb.query.servicios.findMany({
      where: (servicio) =>
        and(
          gte(servicio.fechaServicio, minDate),
          lte(servicio.fechaServicio, maxDate),
        ),
      with: {
        cliente: {
          with: {
            recibos: {
              orderBy: (recibo) => desc(recibo.fechaRecibo),
            },
          },
        },
        servicios: {
          with: {
            operarios: true,
          },
        },
      },
    })

    for (const servicio of _servicios) {
      const { recibos } = servicio.cliente
      const operarios = []
      let i = 0
      for (const operario of servicio.servicios) {
        let acopio = recibos[i].importeRecibo
        if (acopio >= operario.aCobrar) {
          operario.recibo = recibos[i].recibo
          acopio -= operario.aCobrar
          recibos[i].acopio = acopio
          operarios.push(operario)
        } else {
          let cuantoFalta = operario.aCobrar!
          while (acopio < cuantoFalta && i < recibos.length) {
            cuantoFalta -= acopio
            const _operario = { ...operario }
            _operario.recibo = recibos[i].recibo
            _operario.aCobrar = recibos[i].acopio
            acopio = 0
            recibos[i].acopio = acopio
            operarios.push(_operario)
            i++
          }
          if (cuantoFalta > 0) {
            operario.recibo = recibos[i].recibo
            operario.aCobrar = cuantoFalta
            acopio -= cuantoFalta
            recibos[i].acopio = acopio
            operarios.push(operario)
          }
        }
      }
      servicio.servicios = operarios
    }
    const arr = _servicios.reduce<z.infer<typeof responseSchema>>(
      (acc, row) => {
        const busca = acc.find((a) => a.id_servicio === row.idServicio)
        if (busca) {
          busca.servicios ??= []
          row.servicios.forEach((op) => {
            const recibo = row.cliente.recibos.find(
              (r) => r.recibo === op.recibo,
            )
            busca.servicios.push({
              id_servicio: row.idServicio,
              memo: row.memo,
              recibo: op.recibo,
              fecha_recibo: recibo?.fechaRecibo,
              importe_recibo: recibo?.importeRecibo,
              importe_servicio: row.importeServicio,
              acopio: recibo?.acopio,
              legajo: op.operarios?.legajo,
              nombre: op.operarios?.nombre,
              a_cobrar: op.aCobrar,
              cancelado: op.cancelado,
            })
          })
          return acc
        } else {
          const obj = {
            id_servicio: row.idServicio,
            mes: new Date(row.fechaServicio).getUTCMonth(),
            año: new Date(row.fechaServicio).getUTCFullYear(),
            servicios: row.servicios.map((op) => {
              const recibo = row.cliente?.recibos.find(
                (r) => r.recibo === op.recibo,
              )
              return {
                id_servicio: row.idServicio,
                memo: row.memo,
                recibo: op.recibo,
                fecha_recibo: recibo?.fechaRecibo,
                importe_recibo: recibo?.importeRecibo,
                importe_servicio: row.idServicio,
                acopio: recibo?.acopio,
                legajo: op.operarios?.legajo,
                nombre: op.operarios?.nombre,
                a_cobrar: op.aCobrar,
                cancelado: op.cancelado,
              }
            }),
          }

          return acc.concat(obj)
        }
      },
      [],
    )

    return NextResponse.json(arr)
  } catch (error: any) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
