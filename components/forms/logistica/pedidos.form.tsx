import DateField from '@/components/DatePicker'
import CustomInput from '@/components/Input'
import React from 'react'
import Autocomplete from '@/components/Autocomplete'
import { NuevoRepuesto } from '@/components/MiniModals'

function PedidosForm() {
  return (
    <div className="flex w-full justify-between flex-wrap">
      <CustomInput
        label="Orden de Compra"
        name="orden_compra"
        className="w-full basis-5/12"
      />
      <DateField
        label="Fecha del pedido"
        name="fecha_pedido"
        className="w-full basis-5/12"
      />
      <DateField
        label="Fecha de entrega"
        name="fecha_entrega"
        className="w-full basis-5/12"
      />
      <div className="flex w-full basis-5/12 items-end pb-6">
        <Autocomplete
          label="Repuesto"
          name="repuesto"
          options={[]}
          className="w-full p-0"
        />
        <NuevoRepuesto />
      </div>
      <CustomInput
        label="Cantidad"
        name="stock"
        type="number"
        className="w-full basis-5/12"
      />
      <Autocomplete
        label="Proveedor"
        name="proveedor"
        options={[]}
        className="w-full basis-5/12"
      />
    </div>
  )
}

export default PedidosForm
