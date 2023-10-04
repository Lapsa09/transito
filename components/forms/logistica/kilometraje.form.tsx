import DateField from '@/components/DatePicker'
import CustomInput from '@/components/Input'
import React from 'react'

function KilometrajeForm() {
  return (
    <div className="flex w-full px-10 justify-between flex-wrap">
      <DateField label="Fecha" name="fecha" className="w-full basis-5/12" />
      <CustomInput
        label="Kilometraje"
        name="kilometraje"
        className="w-full basis-5/12"
      />
      <CustomInput
        label="Kit Poly V"
        name="kit_poly_v"
        className="w-full basis-5/12"
      />
      <CustomInput
        label="Kit Distribución"
        name="kit_distribucion"
        className="w-full basis-5/12"
      />
      <CustomInput
        label="Proximo cambio Kit Poly V"
        name="proximo_cambio_poly_v"
        className="w-full basis-5/12"
      />
      <CustomInput
        label="Proximo cambio Kit Distribución"
        name="proximo_cambio_distribucion"
        className="w-full basis-5/12"
      />
      <CustomInput
        label="Filtro de Aceite"
        name="filtro_aceite"
        className="w-full basis-5/12"
      />
      <CustomInput
        label="Proximo cambio Filtro Aceite"
        name="proximo_cambio_filtro"
        className="w-full basis-5/12"
      />
    </div>
  )
}

export default KilometrajeForm
