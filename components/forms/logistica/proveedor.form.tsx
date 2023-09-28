import CustomInput from '@/components/Input'
import React from 'react'

function ProveedorForm() {
  return (
    <div className="flex w-full justify-between flex-wrap">
      <CustomInput label="Nombre" name="nombre" className="w-full basis-5/12" />
      <CustomInput label="Tipo" name="tipo" className="w-full basis-5/12" />
      <CustomInput label="Marcas" name="marcas" className="w-full basis-5/12" />
      <CustomInput label="Ciudad" name="ciudad" className="w-full basis-5/12" />
      <CustomInput
        label="Provincia"
        name="provincia"
        className="w-full basis-5/12"
      />
      <CustomInput
        label="Dirección"
        name="direccion"
        className="w-full basis-5/12"
      />
      <CustomInput
        label="Teléfono"
        name="telefono"
        className="w-full basis-5/12"
      />
      <CustomInput label="Email" name="email" className="w-full basis-5/12" />
      <CustomInput
        label="Horarios"
        name="horarios"
        className="w-full basis-5/12"
      />
    </div>
  )
}

export default ProveedorForm
