import { DateTime } from 'luxon'
import axios from 'axios'
import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'
import { RootObject } from '@/types/waze'
import {
  type calles,
  type horarios,
  type nivel_trafico,
  type recorrido,
} from '@prisma/client'

interface Promedio {
  horario: horarios['horario']
  id_trafico: nivel_trafico['id']
  tiempo: recorrido['tiempo']
  tiempo_hist: recorrido['tiempo_hist']
  velocidad: recorrido['velocidad']
  velocidad_hist: recorrido['velocidad_hist']
  calles: calles['calles']
  trafico?: string
}

const xprisma = prisma.$extends({
  model: {
    recorrido: {
      async getPromedio() {
        const data = await prisma.dia.findMany({
          include: {
            reporte: {
              include: {
                horarios: true,
                recorrido: {
                  include: {
                    calles: true,
                    nivel_trafico: true,
                  },
                },
              },
            },
          },
          orderBy: {
            fecha: 'desc',
          },
          take: 15,
        })

        const res = data.reduce<Promedio[]>((acc, curr) => {
          curr.reporte.forEach((rep) => {
            rep.recorrido.forEach((rec) => {
              const index = acc.find(
                (a) =>
                  a.calles === rec.calles.calles &&
                  a.horario === rep.horarios?.horario,
              )

              if (index) {
                index.tiempo += rec.tiempo
                index.tiempo_hist += rec.tiempo_hist
                index.velocidad += rec.velocidad
                index.velocidad_hist += rec.velocidad_hist
                index.id_trafico += rec.nivel_trafico.id
              } else {
                acc.push({
                  tiempo: rec.tiempo,
                  tiempo_hist: rec.tiempo_hist,
                  velocidad: rec.velocidad,
                  velocidad_hist: rec.velocidad_hist,
                  calles: rec.calles.calles,
                  horario: rep.horarios.horario,
                  id_trafico: rec.nivel_trafico.id,
                })
              }
            })
          })

          return acc
        }, [])
        //now i need the average of every numeric value
        const prom = res.map((r) => {
          r.tiempo = Math.round(r.tiempo / data.length)
          r.tiempo_hist = Math.round(r.tiempo_hist / data.length)
          r.velocidad = Math.round(r.velocidad / data.length)
          r.velocidad_hist = Math.round(r.velocidad_hist / data.length)
          r.id_trafico = Math.round(r.id_trafico / data.length)

          return r
        })

        for (const pro of prom) {
          const trafico = await prisma.nivel_trafico.findFirst({
            where: {
              id: pro.id_trafico,
            },
          })

          if (trafico) {
            pro.trafico = trafico.nivel
          }
        }

        return prom
      },
    },
  },
})

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
  'Libertador - a Provincia': 10,
  'Libertador - a Capital': 11,
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
    calles: Array<Omit<recorrido, 'id' | 'id_reporte'> & Omit<calles, 'id'>>
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
      id_calles: calles[r.name as keyof typeof calles],
      tiempo: seconds_to_mins(r.time),
      tiempo_hist: seconds_to_mins(r.historicTime),
      velocidad: get_speed(r.time, r.length),
      velocidad_hist: get_speed(r.historicTime, r.length),
      id_trafico: r.jamLevel + 1,
      calles: r.name,
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
    const res = await prisma.dia.findFirst({
      include: {
        reporte: {
          include: {
            horarios: true,
            recorrido: {
              include: {
                calles: true,
                nivel_trafico: true,
              },
            },
          },
          orderBy: {
            id_horario: 'asc',
          },
        },
      },
      orderBy: {
        fecha: 'desc',
      },
    })

    const promedio = await xprisma.recorrido.getPromedio()

    return NextResponse.json({
      res,
      promedio,
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
      for (const calle of calles) {
        const recorrido = await prisma.recorrido.findFirst({
          where: {
            id_reporte: repetido.id,
            id_calles: calle.id_calles,
          },
        })
        if (recorrido) {
          await prisma.recorrido.update({
            where: {
              id: recorrido.id,
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
        } else {
          await prisma.recorrido.create({
            data: {
              calles: {
                connect: {
                  id: calle.id_calles,
                },
              },
              reporte: {
                connect: {
                  id: repetido.id,
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
      }
    }
    return NextResponse.json('Success')
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
