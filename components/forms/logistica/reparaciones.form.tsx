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
    <div className="flex w-full justify-between flex-wrap">
      <Autocomplete
        options={data?.repuestos}
        label="Repuesto"
        name="repuesto"
      />
      <DateField label="Fecha pedido" name="fecha_pedido" />
      <DateField label="Fecha entrega" name="fecha_entrega" />
      <CustomInput label="Orden de compra" name="orden_compra" />
      <CustomInput label="Retira" name="retira" />
      <CustomInput label="Concepto" name="concepto" />
      <CustomInput label="Estado" name="estado" />
      <DateField label="Fecha reparación" name="fecha" />
      <CustomInput label="Observación" name="observacion" />
    </div>
  )
}

export default ReparacionesForm
