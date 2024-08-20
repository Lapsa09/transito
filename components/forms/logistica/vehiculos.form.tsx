'use client'

import CustomInput from '../../Input'
import CustomSwitch from '../../Switch'
import Autocomplete from '../../Autocomplete'
import { useFormContext } from 'react-hook-form'
import { Vehiculo } from '@/types/logistica'
import { useMemo } from 'react'
import { Dependencia, TipoVehiculo, Uso } from '@/drizzle/schema/logistica'

function VehiculosForm({
  selects,
}: {
  selects: {
    usos: Uso[]
    tipoMoviles: TipoVehiculo[]
    dependencias: Dependencia[]
  }
}) {
  const { watch } = useFormContext<Vehiculo>()

  const usos = useMemo(() => {
    if (!selects?.dependencias) return []
    return selects.usos.filter(
      (uso) => uso.idDependencia === watch('dependencia')?.idDependencia,
    )
  }, [watch('dependencia')])

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
        name="a_o"
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
        options={selects.tipoMoviles}
        inputId="id_tipo"
        inputLabel="tipo"
      />
      <Autocomplete
        name="dependencia"
        label="Dependencia"
        className="w-full basis-5/12"
        options={selects.dependencias}
      />
      <Autocomplete
        name="uso"
        label="Uso"
        className="w-full basis-5/12"
        options={usos}
      />
      <CustomInput
        name="tipo_motor"
        label="Motor"
        className="w-full basis-5/12"
      />
      <CustomInput
        name="tipo_combustible"
        label="Combustible"
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
