'use client'

import { DataTable } from '@/components/table'
import { RepuestosColumns } from './columns'
import { PedidosDTO } from '@/DTO/logistica/pedidos'

export function Repuestos({ data }: { data: PedidosDTO }) {
  return <DataTable data={data.repuestos} columns={RepuestosColumns} />
}
