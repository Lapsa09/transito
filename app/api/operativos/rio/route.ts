import prisma from '@/lib/prismadb'
import { RioFormProps } from '@/types'
import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import { once } from 'events'
import { DateTime } from 'luxon'

const operativoPaseo = async (body: RioFormProps) => {
  const { fecha, turno, lp } = body

  const op = await prisma.nuevo_control_operativos.findFirst({
    where: {
      fecha: new Date(fecha),
      turno,
      lp: +lp,
    },
  })

  if (!op) {
    const { id_op } = await prisma.nuevo_control_operativos.create({
      data: {
        fecha: new Date(fecha),
        turno,
        lp: +lp,
      },
      select: {
        id_op: true,
      },
    })

    return id_op
  } else {
    return op.id_op
  }
}

const radicacion = async (body: RioFormProps) => {
  try {
    const res: number[] = []
    const { dominio } = body

    const pythonProcess = spawn('python', [
      process.env.NEXT_PUBLIC_DNRPA_ROUTE!,
      dominio,
    ])
    pythonProcess.stdout.on('data', async (data) => {
      const decodedData = data.toString()

      const _data = JSON.parse(decodedData.replace(/'/g, '"'))

      const { provincia, localidad } = _data
      if (provincia !== 'BUENOS AIRES' && provincia !== 'CAPITAL FEDERAL') {
        const _res = await prisma.barrios.findFirst({
          where: {
            barrio: provincia,
          },
        })
        res.push(_res!.id_barrio)
      } else {
        if (localidad === 'CAPITAL FEDERAL') {
          res.push(51)
        } else {
          const _res = await prisma.barrios.findFirst({
            where: {
              barrio: {
                contains: localidad,
              },
            },
          })
          if (!_res) {
            const nuevoBarrio = await prisma.barrios.create({
              data: {
                barrio: localidad,
              },
            })
            res.push(nuevoBarrio.id_barrio)
          } else {
            res.push(_res.id_barrio)
          }
        }
      }
    })
    pythonProcess.stdout.on('error', (error) => {
      console.log(error.message)
      return NextResponse.json('El dominio no existe', { status: 400 })
    })

    await once(pythonProcess, 'close')
    return res
  } catch (error) {
    console.log(error)
    throw new Error('Server error')
  }
}

export async function GET() {
  const res = await prisma.nuevo_control_registros.findMany({
    include: {
      operativo: true,
      zona: true,
      barrio: true,
    },
    orderBy: {
      id: 'desc',
    },
  })

  return NextResponse.json(res)
}

export async function POST(req: NextRequest) {
  const data: RioFormProps = await req.json()

  const id_operativo = await operativoPaseo(data)
  const repetido = await prisma.nuevo_control_registros.findFirst({
    where: {
      dominio: data.dominio,
      id_operativo: id_operativo,
    },
  })

  if (repetido) {
    return NextResponse.json('El dominio ya fue cargado', { status: 400 })
  }

  const [id_localidad] = await radicacion(data)

  const _hora = new Date(data.fecha)
  // @ts-ignore
  _hora.setHours(...data.hora.split(':'))

  const res = await prisma.nuevo_control_registros.create({
    data: {
      hora: _hora,
      dominio: data.dominio,
      id_operativo,
      id_zona: data.zona.id_zona,
      id_localidad,
      fechacarga: DateTime.now().toSQL(),
    },
    include: {
      zona: true,
      barrio: true,
      operativo: true,
    },
  })

  return NextResponse.json(res)
}
