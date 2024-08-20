import { db } from '@/drizzle'
import {
  movil,
  pedidoRepuesto,
  proveedor,
  reparaciones,
  repuesto,
} from '@/drizzle/schema/logistica'
import { eq } from 'drizzle-orm'

export async function reparacionesByMovilDTO({
  patente,
  page,
  per_page,
}: {
  patente: string
  page: number
  per_page: number
}) {
  return await db
    .select({
      repuesto: repuesto.item,
      fecha_pedido: pedidoRepuesto.fechaPedido,
      fecha_entrega: pedidoRepuesto.fechaEntrega,
      orden_compra: pedidoRepuesto.ordenCompra,
      retira: reparaciones.retira,
      concepto: reparaciones.concepto,
      estado: reparaciones.estado,
      fecha: reparaciones.fecha,
      observacion: reparaciones.observacion,
    })
    .from(reparaciones)
    .where(eq(reparaciones.patente, patente))
    .innerJoin(repuesto, eq(reparaciones.articulo, repuesto.id))
    .innerJoin(pedidoRepuesto, eq(repuesto.idPedido, pedidoRepuesto.id))
    .innerJoin(proveedor, eq(pedidoRepuesto.idProveedor, proveedor.id))
    .limit(per_page)
    .offset((page - 1) * per_page)
}

export async function reparacionesDTO({
  page,
  per_page,
}: {
  page: number
  per_page: number
}) {
  return await db
    .select({
      repuesto: repuesto.item,
      fecha_pedido: pedidoRepuesto.fechaPedido,
      fecha_entrega: pedidoRepuesto.fechaEntrega,
      orden_compra: pedidoRepuesto.ordenCompra,
      retira: reparaciones.retira,
      concepto: reparaciones.concepto,
      estado: reparaciones.estado,
      fecha: reparaciones.fecha,
      observacion: reparaciones.observacion,
      movil: movil.patente,
    })
    .from(reparaciones)
    .innerJoin(repuesto, eq(reparaciones.articulo, repuesto.id))
    .innerJoin(pedidoRepuesto, eq(repuesto.idPedido, pedidoRepuesto.id))
    .innerJoin(proveedor, eq(pedidoRepuesto.idProveedor, proveedor.id))
    .innerJoin(movil, eq(reparaciones.patente, movil.patente))
    .limit(per_page)
    .offset((page - 1) * per_page)
}

export type ReparacionesDTO = Awaited<ReturnType<typeof reparacionesDTO>>[0]

export type ReparacionesByMovilDTO = Awaited<
  ReturnType<typeof reparacionesByMovilDTO>
>[0]
