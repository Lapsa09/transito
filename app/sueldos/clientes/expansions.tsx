import React from 'react'
import { DataTable } from '@/components'
import { IServicio, Historial, Cliente } from '@/types'
import { OperarioColumns, HistorialColumns, ServicioColumns } from './columns'

type MesProps = {
  data: Cliente
}

type ServicioProps = {
  data: Historial
}

type OperariosProps = {
  data: IServicio
}

function Mes({ data }: MesProps) {
  return (
    <DataTable
      data={data.historial}
      columns={HistorialColumns}
      getRowCanExpand={() => true}
      expand={Servicios}
    />
  )
}

function Servicios({ data }: ServicioProps) {
  return (
    <DataTable
      data={data.servicios}
      columns={ServicioColumns}
      expand={Operarios}
      getRowCanExpand={(row) => row.original.operarios.length > 0}
    />
  )
}

function Operarios({ data }: OperariosProps) {
  return <DataTable data={data.operarios} columns={OperarioColumns} />
}

export default Mes
