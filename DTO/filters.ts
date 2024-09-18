import { db } from '@/drizzle'
import { tipoRepuesto } from '@/drizzle/schema/logistica'
import { zonas } from '@/drizzle/schema/nuevo_control'
import {
  vicenteLopez,
  motivos as motivosSchema,
  tipoLicencias,
  barrios as barriosSchema,
  resolucionSchema,
  turnosSchema,
} from '@/drizzle/schema/schema'

export const filtersDTO = async () => {
  const turnos = turnosSchema.options
  const resolucion = resolucionSchema.options
  const {
    localidades,
    motivos,
    tiposLicencia,
    barrios,
    zonasPaseo,
    tiposRepuesto,
  } = await db.transaction(async (tx) => {
    const localidadesPromise = await tx.select().from(vicenteLopez)
    const motivosPromise = await tx.select().from(motivosSchema)
    const tiposLicenciaPromise = await tx.select().from(tipoLicencias)
    const barriosPromise = await tx.select().from(barriosSchema)
    const zonasPromise = await tx.select().from(zonas)
    const tipoRepuestoPromise = await tx.select().from(tipoRepuesto)
    return {
      localidades: localidadesPromise,
      motivos: motivosPromise,
      tiposLicencia: tiposLicenciaPromise,
      barrios: barriosPromise,
      zonasPaseo: zonasPromise,
      tiposRepuesto: tipoRepuestoPromise,
    }
  })
  return {
    localidad: localidades.map((localidad) => ({
      value: localidad.idBarrio,
      label: localidad.barrio,
    })),
    motivo: motivos
      .map((motivo) => ({
        value: motivo.idMotivo as number | null,
        label: motivo.motivo,
      }))
      .concat([{ value: null, label: 'Vacio' }]),
    tipo_licencia: tiposLicencia
      .map((tipo) => ({
        value: tipo.idTipo as number | null,
        label: tipo.tipo!,
      }))
      .concat([{ value: null, label: 'Vacio' }]),
    zona_infractor: barrios.map((zona) => ({
      value: zona.idBarrio,
      label: zona.barrio,
    })),
    turno: turnos.map((turno) => ({
      value: turno,
      label: turno,
    })),
    resolucion: resolucion.map((resolucion) => ({
      value: resolucion,
      label: resolucion,
    })),
    remito: [
      { value: true, label: 'SI' },
      { value: false, label: 'NO' },
    ],
    carga: [
      { value: true, label: 'SI' },
      { value: false, label: 'NO' },
    ],
    zona: zonasPaseo.map((zona) => ({
      value: zona.idZona,
      label: zona.zona,
    })),
    tipo_repuesto: tiposRepuesto
      .map((tipo) => ({
        value: tipo.idTipoRepuesto as number | null,
        label: tipo.tipo,
      }))
      .concat([{ value: null, label: 'Vacio' }]),
  }
}

export type Filter = Awaited<ReturnType<typeof filtersDTO>>
