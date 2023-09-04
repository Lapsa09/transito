'use client'
import React from 'react'
import { DataTable } from '@/components/table'
import { OperariosColumns } from './columns'
import { Operario } from '@/types/operarios.sueldos'

type OperariosProps = {
  data: Operario
}

function OperariosTable({ data }: OperariosProps) {
  return <DataTable data={data.servicios} columns={OperariosColumns} />
}

export default OperariosTable
