'use client'
import React, { useState } from 'react'
import { exportAgenda, getServicios } from '@/services'
import { DataTable } from '@/components/table'
import { ServicioColumns } from './columns'
import Mes from './expansions'
import useSWR from 'swr'
import Button from '@/components/Button'
import { FormProvider, useForm } from 'react-hook-form'
import DateField from '@/components/DatePicker'
import CSVDownloadButton from '@/components/CSVDownloadButton'

function page() {
  const { data, isLoading } = useSWR('servicios', getServicios)
  const [exported, setExported] = useState(false)
  const methods = useForm<{ fecha: string }>()
  const { getValues } = methods

  const handleExport = async () => {
    const { fecha } = getValues()
    return await exportAgenda({ body: { fecha } })
  }

  if (isLoading) return null
  return (
    <div>
      <Button onClick={() => setExported(!exported)}>Exportar</Button>
      {exported && (
        <div className="flex">
          <FormProvider {...methods}>
            <DateField name="fecha" label="Fecha" />
            <CSVDownloadButton fetcher={handleExport}>
              Exportar
            </CSVDownloadButton>
          </FormProvider>
        </div>
      )}
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
