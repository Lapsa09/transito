'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import DateField from '@/components/DatePicker'
import { RegularForm } from '@/components/forms/layout.form'
import { SubmitHandler } from 'react-hook-form'
import { exportAgenda } from '@/services'
import { exporter } from '@/utils/csvExport'

function Export() {
  const [exported, setExported] = useState(false)

  const handleExport: SubmitHandler<{ fecha: string }> = async (body) => {
    const data = await exportAgenda({ body })

    exporter(data)
  }
  return (
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
  )
}

export default Export
