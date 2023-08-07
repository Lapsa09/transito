'use client'
import React from 'react'
import { DataTable } from '@/components/table'
import { Servicio } from '@/types/servicios.sueldos'
import { OperarioColumns } from './columns'

type MesProps = {
  data: Servicio
}

function Mes({ data }: MesProps) {
  return <DataTable data={data.servicios} columns={OperarioColumns} />
}

export default Mes
