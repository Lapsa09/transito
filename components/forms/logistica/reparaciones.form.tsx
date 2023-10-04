'use client'

import React from 'react'
import Autocomplete from '@/components/Autocomplete'
import useSWR from 'swr'
import { getSelects } from '@/services'
import DateField from '@/components/DatePicker'
import CustomInput from '@/components/Input'

function ReparacionesForm() {
  const { data, isLoading } = useSWR('api/selects', getSelects)

  if (isLoading) return null
  return (
    <div className="flex w-full px-10 justify-between flex-wrap">
      <Autocomplete
        options={data?.repuestos}
        label="Repuesto"
        name="repuesto"
        className="w-full basis-5/12"
      />
      <DateField label="Fecha" name="fecha" className="w-full basis-5/12" />
      <CustomInput
        label="Orden de compra"
        name="orden_compra"
        className="w-full basis-5/12"
      />
      <CustomInput label="Retira" name="retira" className="w-full basis-5/12" />
      <CustomInput
        label="Concepto"
        name="concepto"
        className="w-full basis-5/12"
      />
      <CustomInput label="Estado" name="estado" className="w-full basis-5/12" />
      <DateField
        label="Fecha reparación"
        name="fecha"
        className="w-full basis-5/12"
      />
      <CustomInput
        label="Observación"
        name="observacion"
        className="w-full basis-5/12"
      />
    </div>
  )
}

export default ReparacionesForm
