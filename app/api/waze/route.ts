import { DateTime } from 'luxon'
import axios from 'axios'
import prisma from '@/lib/prismadb'
import { NextRequest, NextResponse } from 'next/server'

const promedio = (data: any[]) => {
  const res: Record<any, any> = {}
  data.forEach((d) => {
    res[d.horario] ??= []
    res[d.horario].push({
      id: d.id_calles,
      calles: d.calles,
      trafico: Math.round(d.nivel_trafico),
      tiempo: Math.round(d.tiempo),
      tiempo_hist: Math.round(d.tiempo_hist),
      velocidad: Math.round(d.velocidad),
      velocidad_hist: Math.round(d.velocidad_hist),
    })
  })
  return res
}

const calles = {
  'Laprida - Maipu a B. Parera': 1,
  'Laprida - B.Parera a Maipu': 2,
  'Acassuso  -  Libertador a B. Parera ': 3,
  'Acassuso -  Maipu a B. Parera ': 4,
  'Malaver - B. Parera a Maipu': 5,
  'San Lorenzo - B. Parera a Maipu': 6,
  'Villate  -  Maipu a B. Parera ': 7,
  'Roca -  Maipu a B. Parera ': 8,
  'Melo - B. Parera a Maipu': 9,
}

const horas = (h: number) => {
  if (h >= 8 && h < 11) return 1
  if (h >= 11 && h < 16) return 2
  if (h >= 16) return 3
}

const seconds_to_mins = (secs: number) => {
  return Math.round(secs / 60)
}

const seconds_to_hrs = (secs: number) => {
  return seconds_to_mins(secs) / 60
}

const meters_to_kms = (mts: number) => {
  return Math.round(mts / 1000)
}

const get_speed = (secs: number, mts: number) => {
  return Math.round(meters_to_kms(mts) / seconds_to_hrs(secs))
}

const fetchWaze = async (req: NextRequest) => {
  try {
    const {
      data: { routes },
    } = await axios.get(process.env.WAZE_API!)

    const body: Record<'calles' | 'hora' | 'fecha', any> = {
      calles: null,
      hora: null,
      fecha: null,
    }

    body.calles = routes
      .filter((r: any) => Object.keys(calles).includes(r.name))
      .map((r: any) => ({
        calle: calles[r.name as keyof typeof calles],
        tiempo: seconds_to_mins(r.time),
        tiempo_hist: seconds_to_mins(r.historicTime),
        velocidad: get_speed(r.time, r.length),
        velocidad_hist: get_speed(r.historicTime, r.length),
        trafico: r.jamLevel + 1,
      }))
    body.hora = horas(DateTime.now().setLocale('es-AR').hour)
    const repetido = await prisma.dia.findFirst({
      where: {
        fecha: DateTime.now().toFormat('MM/dd/yyyy'),
      },
    })
    if (repetido) body.fecha = repetido.id
    else {
      const { id } = await prisma.dia.create({
        data: { fecha: DateTime.now().toFormat('MM/dd/yyyy') },
      })
      body.fecha = id
    }
    return body
  } catch (error) {
    console.log(error)
    NextResponse.json('Server error', { status: 500 })
  }
}

export async function GET() {
  try {
    const reportesPrisma = await prisma.reporte.findMany({
      include: {
        dia: true,
        recorrido: {
          include: {
            calles: true,
            nivel_trafico: true,
          },
        },
        horarios: true,
      },
    })

    const promediosPrisma = await prisma.recorrido.findMany({
      where: {
        reporte: {
          dia: {
            fecha: {
              gte: DateTime.now().minus({ days: 15 }).toFormat('MM/dd/yyyy'),
            },
          },
        },
      },
      select: {
        tiempo: true,
        tiempo_hist: true,
        velocidad: true,
        velocidad_hist: true,
        calles: {
          select: {
            calles: true,
          },
        },
        reporte: {
          select: {
            horarios: {
              select: {
                horario: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({
      res: reportesPrisma,
      promedio: promedio(promediosPrisma),
    })
  } catch (error: any) {
    console.log(error.message)
    return NextResponse.json('Server error', { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    //@ts-ignore
    const { calles, fecha, hora } = await fetchWaze(req)

    const repetido = await prisma.reporte.findFirst({
      where: {
        id_dia: fecha,
        id_horario: hora,
      },
    })

    if (!repetido) {
      const { id: id_reporte } = await prisma.reporte.create({
        data: {
          id_dia: fecha,
          id_horario: hora,
        },
      })
      for (const calle of calles) {
        await prisma.recorrido.create({
          data: {
            id_calles: calle.calle,
            id_reporte,
            tiempo: calle.tiempo,
            tiempo_hist: calle.tiempo_hist,
            velocidad: calle.velocidad,
            velocidad_hist: calle.velocidad_hist,
            id_trafico: calle.trafico,
          },
        })
      }
    } else {
      // await pool.query(
      //   'update waze.recorrido set id_calles=$1, tiempo=$2, tiempo_hist=$3, velocidad=$4, velocidad_hist=$5, id_trafico=$6 where id_reporte=$7',
      //   [
      //     calle.calle,
      //     calle.tiempo,
      //     calle.tiempo_hist,
      //     calle.velocidad,
      //     calle.velocidad_hist,
      //     calle.trafico,
      //     repetido.rows[0].id,
      //   ],
      // )
      for (const calle of calles)
        await prisma.recorrido.update({
          // @ts-ignore
          where: {
            id_reporte: repetido.id,
          },
          data: {
            id_calles: calle.calle,
            tiempo: calle.tiempo,
            tiempo_hist: calle.tiempo_hist,
            velocidad: calle.velocidad,
            velocidad_hist: calle.velocidad_hist,
            id_trafico: calle.trafico,
          },
        })
    }
    return NextResponse.json('Success')
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
