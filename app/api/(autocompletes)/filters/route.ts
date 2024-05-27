import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const localidadesPromise = prisma.vicente_lopez.findMany()
    const turnos = ['MAÑANA', 'TARDE', 'NOCHE']
    const motivosPromise = prisma.motivos.findMany()
    const tiposLicenciaPromise = prisma.tipo_licencias.findMany()
    const barriosPromise = prisma.barrios.findMany()
    const resolucion = ['PREVENCION', 'ACTA', 'REMITIDO']
    const zonasPromise = prisma.zonas.findMany()
    const [localidades, motivos, tiposLicencia, barrios, zonas] =
      await Promise.all([
        localidadesPromise,
        motivosPromise,
        tiposLicenciaPromise,
        barriosPromise,
        zonasPromise,
      ])
    return NextResponse.json({
      localidad: localidades.map((localidad) => localidad.barrio),
      motivo: motivos.map((motivo) => motivo.motivo).concat('null'),
      tipo_licencia: tiposLicencia.map((tipo) => tipo.tipo).concat('null'),
      zona_infractor: barrios.map((zona) => zona.barrio),
      turno: turnos,
      resolucion: resolucion,
      remito: ['SI', 'NO'],
      carga: ['SI', 'NO'],
      zona: zonas.map((zona) => zona.zona),
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json('Server error', { status: 500 })
  }
}
