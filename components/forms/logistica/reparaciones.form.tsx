import React from 'react'
import Autocomplete from '@/components/Autocomplete'
import DateField from '@/components/DatePicker'
import CustomInput from '@/components/Input'
import { Repuestos } from '@/drizzle/schema/logistica'

function ReparacionesForm<T>({
  patente,
  selects,
}: {
  patente: string
  selects: { repuestos: Repuestos[] }
}) {
  return (
    <div className="flex w-full px-10 justify-between flex-wrap">
      <CustomInput
        label="Patente"
        name="patente"
        className="w-full"
        defaultValue={patente}
        isDisabled
      />
      <Autocomplete
        options={selects.repuestos}
        label="Repuesto"
        name="repuesto"
        className="w-full basis-5/12"
        inputId="id"
        inputLabel="item"
      />
      <DateField label="Fecha" name="fecha" className="w-full basis-5/12" />
      <CustomInput label="Retira" name="retira" className="w-full basis-5/12" />
      <CustomInput
        label="Concepto"
        name="concepto"
        className="w-full basis-5/12"
      />
      <CustomInput label="Estado" name="estado" className="w-full basis-5/12" />
      <CustomInput
        label="Observación"
        name="observacion"
        className="w-full basis-5/12"
      />
    </div>
  )
}

export default ReparacionesForm
