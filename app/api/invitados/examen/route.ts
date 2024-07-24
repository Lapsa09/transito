import prisma from '@/lib/prismadb'
import { NextRequest, NextResponse } from 'next/server'
import { examen } from '@prisma/client'
import { getter, setter } from '@/services'
import { splitFullName } from '@/utils/misc'
import { ScheduleList } from '@/types/citymis.examen'

// const getFromCitymis = async () => {
//   try {
//     const schedule_list = await getter<ScheduleList[]>({
//       route: 'examen/citymis',
//     })
//     for (const examen of schedule_list) {
//       const regex = /(.+?)\s+\((.+?)\)/

//       // Aplicar la expresión regular y obtener las partes
//       const resultado = examen.citizen.match(regex)
//       let apellido, nombre, dni
//       if (resultado) {
//         // Las partes estarán en los índices 1 y 2 del array resultado
//         const nombreCompleto = resultado[1]
//         dni = resultado[2]
//         apellido = splitFullName(nombreCompleto)[0]
//         nombre = splitFullName(nombreCompleto)[1]
//       }

//       const fecha = new Date(examen.schedule_time).toISOString()

//       const data = await setter<examen>({
//         route: 'admision/examen',
//         body: {
//           fecha,
//           terminado: examen.status.includes('Vencido'),
//         },
//       })
//       await setter({
//         route: `admision/examen/${data.id}`,
//         body: {
//           nombre,
//           apellido,
//           dni,
//           clave: data.clave,
//         },
//       })
//     }
//   } catch (error) {
//     return
//   }
// }

export async function GET(req: NextRequest) {
  // await getFromCitymis()
  const { searchParams } = req.nextUrl
  try {
    const examenes = await prisma.examen.findMany({
      where: {
        terminado: false,
      },
    })

    return NextResponse.json(examenes)
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
