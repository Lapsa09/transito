'use client'

import useSWR from 'swr'
import CustomInput from '../../Input'
import CustomSwitch from '../../Switch'
import { getSelects } from '@/services'
import Autocomplete from '../../Autocomplete'

function VehiculosForm() {
  const { data, isLoading } = useSWR('api/selects', getSelects)

  if (isLoading) return null
  return (
    <div className="flex w-full px-10 justify-between flex-wrap">
      <CustomInput.Dominio
        name="patente"
        label="Patente"
        className="w-full basis-5/12"
      />
      <CustomInput name="marca" label="Marca" className="w-full basis-5/12" />
      <CustomInput name="modelo" label="Modelo" className="w-full basis-5/12" />
      <CustomInput
        name="año"
        label="Año"
        type="number"
        className="w-full basis-5/12"
      />
      <CustomInput
        name="nro_movil"
        label="Nro movil"
        className="w-full basis-5/12"
      />
      <Autocomplete
        name="tipo_vehiculo"
        label="Tipo de vehiculo"
        className="w-full basis-5/12"
        options={data?.tipoMoviles}
      />
      <Autocomplete
        name="dependencia"
        label="Dependencia"
        className="w-full basis-5/12"
        options={data?.dependencias}
      />
      <Autocomplete
        name="uso"
        label="Uso"
        className="w-full basis-5/12"
        options={data?.usos}
      />
      <CustomInput
        name="tipo_motor"
        label="Motor"
        className="w-full basis-5/12"
      />
      <CustomInput
        name="empresa_seguimiento"
        label="Empresa de seguimiento"
        className="w-full basis-5/12"
      />
      <CustomInput
        name="no_chasis"
        label="Nro chasis"
        className="w-full basis-5/12"
      />
      <CustomInput
        name="id_megatrans"
        label="Id megatrans"
        className="w-full basis-5/12"
      />
      <CustomSwitch
        name="plan_renovacion"
        label="Posee plan de renovacion?"
        className="w-full basis-5/12 max-w-full"
      />
    </div>
  )
}

export default VehiculosForm
