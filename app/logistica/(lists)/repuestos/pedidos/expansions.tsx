'use client'

import { DataTable } from '@/components/table'
import { PedidoRepuesto } from '@/types/logistica'
import { RepuestosColumns } from './columns'

export function Repuestos({ data }: { data: PedidoRepuesto }) {
  return <DataTable data={data.repuestos} columns={RepuestosColumns} />
}
