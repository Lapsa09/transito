import DateField from '@/components/DatePicker'
import CustomInput from '@/components/Input'
import React from 'react'

function KilometrajeForm() {
  return (
    <div className="flex w-full justify-between flex-wrap">
      <DateField label="Fecha" name="fecha" />
      <CustomInput label="Kilometraje" name="kilometraje" />
      <CustomInput label="Kit Poly V" name="kit_poly_v" />
      <CustomInput label="Kit Distribución" name="kit_distribucion" />
      <CustomInput
        label="Proximo cambio Kit Poly V"
        name="proximo_cambio_poly_v"
      />
      <CustomInput
        label="Proximo cambio Kit Distribución"
        name="proximo_cambio_distribucion"
      />
      <CustomInput label="Filtro de Aceite" name="filtro_aceite" />
      <CustomInput
        label="Proximo cambio Filtro Aceite"
        name="proximo_cambio_filtro"
      />
    </div>
  )
}

export default KilometrajeForm
