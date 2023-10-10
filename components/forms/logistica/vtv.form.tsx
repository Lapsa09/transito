import DateField from '@/components/DatePicker'
import CustomInput from '@/components/Input'
import React from 'react'

function VTVForm({ patente }: { patente: string }) {
  return (
    <div className="flex w-full px-10 justify-between flex-wrap">
      <CustomInput
        label="Patente"
        name="patente"
        className="w-full"
        defaultValue={patente}
        isDisabled
      />
      <DateField
        label="Fecha de emision"
        name="fecha_emision"
        className="w-full basis-5/12"
      />
      <CustomInput
        label="Observacion"
        name="observacion"
        className="w-full basis-5/12"
      />
      <DateField
        label="Vencimiento"
        name="vencimiento"
        className="w-full basis-5/12"
      />
      <CustomInput label="Estado" name="estado" className="w-full basis-5/12" />
      <CustomInput
        label="Condicion"
        name="condicion"
        className="w-full basis-5/12"
      />
    </div>
  )
}

export default VTVForm
