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
  const { watch } = methods

  const handleExport = async () => {
    const { fecha } = watch()
    return await exportAgenda({ body: { fecha } })
  }

  if (isLoading) return null
  return (
    <div>
      <div className="flex items-center h-24 gap-4">
        <Button onClick={() => setExported(!exported)}>
          Exportar servicios del dia...
        </Button>
        {exported && (
          <div className="flex items-center w-1/4">
            <FormProvider {...methods}>
              <DateField name="fecha" label="Fecha" />
              <CSVDownloadButton fetcher={handleExport}>
                Exportar
              </CSVDownloadButton>
            </FormProvider>
          </div>
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
