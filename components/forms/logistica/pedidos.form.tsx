'use client'

import DateField from '@/components/DatePicker'
import CustomInput from '@/components/Input'
import React from 'react'
import Autocomplete from '@/components/Autocomplete'
import { useFieldArray } from 'react-hook-form'
import { PedidoForm } from '@/types/logistica'
import { Button } from '@/components/ui/button'
import { Proveedor, TipoRepuesto } from '@/drizzle/schema/logistica'

function PedidosForm({
  selects,
}: {
  selects: { proveedores: Proveedor[]; tipoRepuestos: TipoRepuesto[] }
}) {
  const { append, fields, remove } = useFieldArray<PedidoForm>({
    name: 'repuestos',
  })

  const agregarRepuesto = () => {
    append({
      tipo_repuesto: {
        idTipoRepuesto: 0,
        tipo: '',
      },
      item: '',
      cantidad: 0,
    })
  }

  return (
    <div className="flex w-full px-10 justify-between flex-wrap">
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
      <Autocomplete
        label="Proveedor"
        name="proveedor"
        options={selects.proveedores}
        className="w-full basis-5/12"
        inputId="id"
        inputLabel="nombre"
      />

      <div className="w-full flex flex-col items-center mb-6">
        <h3>Repuestos: {fields.length}</h3>
        <Button variant="link" className="text-xl" onClick={agregarRepuesto}>
          Añadir
        </Button>
        {fields.map((field, index) => (
          <div className="w-full" key={field.id}>
            <Button
              variant="link"
              className="text-danger-500 hover:text-danger-200 mb-3"
              onClick={() => fields.length > 0 && remove(index)}
            >
              Eliminar
            </Button>
            <div className="w-full">
              <Autocomplete
                label="Tipo de repuesto"
                name={`repuestos[${index}].tipo_repuesto`}
                options={selects.tipoRepuestos}
                inputId="id_tipo_repuesto"
                inputLabel="tipo"
                className="w-full basis-5/12"
              />
              <CustomInput
                label="Item"
                name={`repuestos[${index}].item`}
                className="w-full basis-5/12"
              />
              <CustomInput
                label="Cantidad"
                name={`repuestos[${index}].cantidad`}
                className="w-full basis-5/12"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PedidosForm
