import DateField from '@/components/DatePicker'
import CustomInput from '@/components/Input'
import React from 'react'

function KilometrajeForm({ patente }: { patente: string }) {
  return (
    <div className="flex w-full px-10 justify-between flex-wrap">
      <CustomInput
        label="Patente"
        name="patente"
        className="w-full"
        defaultValue={patente}
        isDisabled
      />
      <DateField label="Fecha" name="fecha" className="w-full basis-5/12" />
      <CustomInput
        label="Kilometraje"
        name="km"
        className="w-full basis-5/12"
        type="number"
      />
      <CustomInput
        label="Kit Poly V"
        name="kit_poly_v"
        className="w-full basis-5/12"
        type="number"
      />
      <CustomInput
        label="Kit Distribución"
        name="kit_distribucion"
        className="w-full basis-5/12"
        type="number"
      />
      <CustomInput
        label="Proximo cambio Kit Poly V"
        name="proximo_cambio_poly_v"
        className="w-full basis-5/12"
        type="number"
      />
      <CustomInput
        label="Proximo cambio Kit Distribución"
        name="proximo_cambio_distribucion"
        className="w-full basis-5/12"
        type="number"
      />
      <CustomInput
        label="Filtro de Aceite"
        name="filtro_aceite"
        className="w-full basis-5/12"
        type="number"
      />
      <CustomInput
        label="Proximo cambio Filtro Aceite"
        name="proximo_cambio_filtro"
        className="w-full basis-5/12"
        type="number"
      />
    </div>
  )
}

export default KilometrajeForm
