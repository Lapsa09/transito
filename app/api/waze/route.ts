import { DateTime } from 'luxon'
import axios from 'axios'
import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'
import { RootObject } from '@/types/waze'
import { calles, recorrido } from '@prisma/client'

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
  return 3
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

const fetchWaze = async () => {
  const {
    data: { routes },
  } = await axios.get<RootObject>(process.env.WAZE_API!)

  const body: {
    calles: Partial<recorrido & calles>[]
    hora: number
    fecha: number
  } = {
    calles: [],
    hora: 0,
    fecha: 0,
  }

  body.calles = routes
    .filter((r) => Object.keys(calles).includes(r.name))
    .map((r) => ({
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
      fecha: DateTime.now().toISO()!,
    },
  })
  if (repetido) body.fecha = repetido.id
  else {
    const { id } = await prisma.dia.create({
      data: { fecha: DateTime.now().toISO()! },
    })
    body.fecha = id
  }
  return body
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

export async function POST() {
  try {
    const { calles, fecha, hora } = await fetchWaze()

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
            calles: {
              connect: {
                id: calle.id_calles,
              },
            },
            reporte: {
              connect: {
                id: id_reporte,
              },
            },
            nivel_trafico: {
              connect: {
                id: calle.id_trafico,
              },
            },
            tiempo: calle.tiempo,
            tiempo_hist: calle.tiempo_hist,
            velocidad: calle.velocidad,
            velocidad_hist: calle.velocidad_hist,
          },
        })
      }
    } else {
      for (const calle of calles)
        await prisma.recorrido.update({
          // @ts-ignore
          where: {
            id_reporte: repetido.id,
          },
          data: {
            calles: {
              connect: {
                id: calle.id_calles,
              },
            },
            nivel_trafico: {
              connect: {
                id: calle.id_trafico,
              },
            },
            tiempo: calle.tiempo,
            tiempo_hist: calle.tiempo_hist,
            velocidad: calle.velocidad,
            velocidad_hist: calle.velocidad_hist,
          },
        })
    }
    return NextResponse.json('Success')
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
