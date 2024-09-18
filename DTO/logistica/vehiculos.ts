import { db } from '@/drizzle'
import {
  dependencia,
  movil,
  tipoVehiculo,
  uso,
} from '@/drizzle/schema/logistica'
import { SQL, eq } from 'drizzle-orm'

export async function vehiculosDTO({
  page,
  per_page,
  where,
}: {
  page: number
  per_page: number
  where?: SQL
}) {
  return await db
    .select({
      patente: movil.patente,
      marca: movil.marca,
      modelo: movil.modelo,
      año: movil.año,
      tipo: tipoVehiculo.tipo,
      tipo_combustible: movil.tipoCombustible,
      tipo_motor: movil.tipoMotor,
      no_chasis: movil.noChasis,
      uso: uso.uso,
      dependencia: dependencia.dependencia,
      id_megatrans: movil.idMegatrans,
      plan_renovacion: movil.planRenovacion,
      empresa_seguimiento: movil.empresaSeguimiento,
      seguro: movil.seguro,
    })
    .from(movil)
    .where(where)
    .innerJoin(uso, eq(movil.idUso, uso.idUso))
    .limit(per_page)
    .offset((page - 1) * per_page)
    .innerJoin(dependencia, eq(movil.idDependencia, dependencia.idDependencia))
    .innerJoin(tipoVehiculo, eq(movil.idTipoVehiculo, tipoVehiculo.idTipo))
}

export type VehiculoDTO = Awaited<ReturnType<typeof vehiculosDTO>>[0]
