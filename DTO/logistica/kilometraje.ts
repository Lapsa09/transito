import { db } from '@/drizzle'
import { kilometrajeVehiculos, movil } from '@/drizzle/schema/logistica'
import { SQL, eq } from 'drizzle-orm'

export async function kilometrajeDTO({
  page = 1,
  per_page = 10,
  where,
}: {
  patente: string
  page: number
  per_page: number
  where?: SQL
}) {
  return db
    .select({
      fecha: kilometrajeVehiculos.fecha,
      km: kilometrajeVehiculos.km,
      filtro_aceite: kilometrajeVehiculos.filtroAceite,
      proximo_cambio_filtro: kilometrajeVehiculos.proximoCambioFiltro,
      kit_distribucion: kilometrajeVehiculos.kitDistribucion,
      proximo_cambio_distribucion:
        kilometrajeVehiculos.proximoCambioDistribucion,
      kit_poly_v: kilometrajeVehiculos.kitPolyV,
      proximo_cambio_poly_v: kilometrajeVehiculos.proximoCambioPolyV,
    })
    .from(kilometrajeVehiculos)
    .innerJoin(movil, eq(kilometrajeVehiculos.patente, movil.patente))
    .where(where)
    .limit(per_page)
    .offset((page - 1) * per_page)
}

export type KilometrajeDTO = Awaited<ReturnType<typeof kilometrajeDTO>>[0]
