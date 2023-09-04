'use client'
import React from 'react'
import { DataTable } from '@/components/table'
import { Servicio, Historial, Cliente } from '@/types'
import { OperarioColumns, HistorialColumns, ServicioColumns } from './columns'

type MesProps = {
  data: Cliente
}

type ServicioProps = {
  data: Historial
}

type OperariosProps = {
  data: Servicio
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
      getRowCanExpand={(row) => row.original.operarios_servicios.length > 0}
    />
  )
}

function Operarios({ data }: OperariosProps) {
  return <DataTable data={data.operarios_servicios} columns={OperarioColumns} />
}

export default Mes
