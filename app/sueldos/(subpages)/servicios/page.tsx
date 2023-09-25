'use client'
import React, { useState } from 'react'
import { exportAgenda, getServicios } from '@/services'
import { DataTable } from '@/components/table'
import { ServicioColumns } from './columns'
import Mes from './expansions'
import useSWR from 'swr'
import Button from '@/components/Button'
import { SubmitHandler } from 'react-hook-form'
import DateField from '@/components/DatePicker'
import { RegularForm } from '@/components/forms/layout.form'
import { exporter } from '@/utils/csvExport'

function page() {
  const { data, isLoading } = useSWR('servicios', getServicios)
  const [exported, setExported] = useState(false)

  const handleExport: SubmitHandler<{ fecha: string }> = async (body) => {
    const data = await exportAgenda({ body })

    exporter(data)
  }

  if (isLoading) return null
  return (
    <div>
      <div className="flex items-center h-24 gap-4">
        <Button onClick={() => setExported(!exported)}>
          Exportar servicios del dia...
        </Button>
        {exported && (
          <RegularForm
            className="flex items-center w-1/4"
            onSubmit={handleExport}
          >
            <DateField name="fecha" label="Fecha" rules={{ required: true }} />
            <Button type="submit">Exportar</Button>
          </RegularForm>
        )}
      </div>
      <DataTable
        columns={ServicioColumns}
        data={data}
        expand={Mes}
        getRowCanExpand={(row) => row.original.operarios_servicios?.length > 0}
      />
    </div>
  )
}

export default page
