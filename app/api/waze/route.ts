import { DateTime } from 'luxon'
import axios from 'axios'
import { NextResponse } from 'next/server'
import { RootObject } from '@/types/waze'
import { db, wazedb } from '@/drizzle'
import {
  calles,
  dia,
  horarios,
  nivelTrafico,
  recorrido,
  reporte,
} from '@/drizzle/schema/waze'
import { eq, arrayContains, desc, sql, avg } from 'drizzle-orm'

const callesList = {
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
    calles: Array<
      Omit<typeof recorrido.$inferSelect, 'id' | 'idReporte'> &
        Omit<typeof calles.$inferSelect, 'id'>
    >
    hora: number
    fecha: number
  } = {
    calles: [],
    hora: 0,
    fecha: 0,
  }

  body.calles = routes
    .filter((r) => Object.keys(callesList).includes(r.name))
    .map((r) => ({
      idCalles: callesList[r.name as keyof typeof callesList],
      tiempo: seconds_to_mins(r.time),
      tiempoHist: seconds_to_mins(r.historicTime),
      velocidad: get_speed(r.time, r.length),
      velocidadHist: get_speed(r.historicTime, r.length),
      idTrafico: r.jamLevel + 1,
      calles: r.name,
    }))
  body.hora = horas(DateTime.now().setLocale('es-AR').hour)
  const repetido = await wazedb.query.dia.findFirst({
    where(fields, { eq }) {
      return eq(fields.fecha, sql`to_date(${new Date()}, 'YYYY-MM-DD')`)
    },
  })
  if (repetido) body.fecha = repetido.id
  else {
    const [{ id }] = await db
      .insert(dia)
      .values({ fecha: sql`to_date(${new Date()}, 'YYYY-MM-DD')` })
      .returning({ id: dia.id })
    body.fecha = id
  }
  return body
}

export async function GET() {
  try {
    const res = await wazedb.query.dia.findFirst({
      with: {
        reportes: {
          with: {
            horarios: true,
            recorridos: {
              with: {
                calles: true,
                nivelTrafico: true,
              },
            },
          },
          orderBy: (reporte, { asc }) => asc(reporte.idHorario),
        },
      },
      orderBy: (dia, { desc }) => desc(dia.fecha),
    })

    const promedio = await db
      .select({
        id_trafico: sql<number>`case when ${avg(recorrido.velocidadHist).mapWith(Number)}-${avg(recorrido.velocidad).mapWith(Number)} >1 then ceil(${avg(nivelTrafico.id).mapWith(Number)}) else floor(${avg(nivelTrafico.id).mapWith(Number)}) end`,
        tiempo: sql<number>`round(${avg(recorrido.tiempo).mapWith(Number)})`,
        tiempo_hist: sql<number>`round(${avg(recorrido.tiempoHist).mapWith(Number)})`,
        velocidad: sql<number>`round(${avg(recorrido.velocidad).mapWith(Number)})`,
        velocidad_hist: sql<number>`round(${avg(recorrido.velocidadHist).mapWith(Number)})`,
        calles: calles.calles,
        horario: horarios.horario,
        trafico: nivelTrafico.nivel,
      })
      .from(recorrido)
      .innerJoin(calles, eq(recorrido.idCalles, calles.id))
      .innerJoin(reporte, eq(recorrido.idReporte, reporte.id))
      .innerJoin(horarios, eq(reporte.idHorario, horarios.id))
      .innerJoin(nivelTrafico, eq(nivelTrafico.id, 1))
      .where(
        arrayContains(
          reporte.idDia,
          db
            .select({ id: dia.id })
            .from(dia)
            .orderBy(desc(dia.fecha))
            .limit(15),
        ),
      )
      .groupBy(
        calles.calles,
        horarios.horario,
        reporte.idHorario,
        nivelTrafico.nivel,
      )
      .orderBy(calles.calles, horarios.horario)

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

    const repetido = await wazedb.query.reporte.findFirst({
      where(fields, { eq, and }) {
        return and(eq(fields.idDia, fecha), eq(fields.idHorario, hora))
      },
    })

    if (!repetido) {
      const [{ id_reporte }] = await db
        .insert(reporte)
        .values({
          idDia: fecha,
          idHorario: hora,
        })
        .returning({ id_reporte: reporte.id })

      for (const calle of calles) {
        await db.insert(recorrido).values({
          idCalles: calle.idCalles,
          idReporte: id_reporte,
          tiempo: calle.tiempo,
          tiempoHist: calle.tiempoHist,
          velocidad: calle.velocidad,
          velocidadHist: calle.velocidadHist,
          idTrafico: calle.idTrafico,
        })
      }
    } else {
      for (const calle of calles) {
        const recorridoRep = await wazedb.query.recorrido.findFirst({
          where(fields, { eq, and }) {
            return and(
              eq(fields.idReporte, repetido.id),
              eq(fields.idCalles, calle.idCalles),
            )
          },
        })
        if (recorridoRep) {
          await db
            .update(recorrido)
            .set({
              tiempo: calle.tiempo,
              tiempoHist: calle.tiempoHist,
              velocidad: calle.velocidad,
              velocidadHist: calle.velocidadHist,
              idTrafico: calle.idTrafico,
            })
            .where(eq(recorrido.id, recorridoRep.id))
        } else {
          await db.insert(recorrido).values({
            idCalles: calle.idCalles,
            idReporte: repetido.id,
            tiempo: calle.tiempo,
            tiempoHist: calle.tiempoHist,
            velocidad: calle.velocidad,
            velocidadHist: calle.velocidadHist,
            idTrafico: calle.idTrafico,
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
