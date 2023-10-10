'use client'

import DateField from '@/components/DatePicker'
import CustomInput from '@/components/Input'
import React from 'react'
import Autocomplete from '@/components/Autocomplete'
import useSWR from 'swr'
import { getSelects } from '@/services'
import { useFieldArray } from 'react-hook-form'
import { PedidoForm } from '@/types/logistica'

function PedidosForm() {
  const { data } = useSWR('api/selects', getSelects)
  const { append, fields, remove } = useFieldArray<PedidoForm>({
    name: 'repuestos',
  })

  const agregarRepuesto = () => {
    append({
      tipo_repuesto: {
        id_tipo_repuesto: 0,
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
        options={data?.proveedores}
        className="w-full basis-5/12"
        inputId="id"
        inputLabel="nombre"
      />

      <div>
        <h3>Repuestos: {fields.length}</h3>
        <span onClick={agregarRepuesto}>Añadir</span>
        {fields.map((field, index) => (
          <div key={field.id}>
            <Autocomplete
              label="Tipo de repuesto"
              name={`repuestos[${index}].tipo_repuesto`}
              options={data?.tipoRepuestos}
              inputId="id_tipo_repuesto"
              inputLabel="tipo"
            />
            <CustomInput label="Item" name={`repuestos[${index}].item`} />
            <CustomInput
              label="Cantidad"
              name={`repuestos[${index}].cantidad`}
              className="w-full basis-5/12"
            />
            <button
              type="button"
              onClick={() => fields.length > 0 && remove(index)}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PedidosForm
