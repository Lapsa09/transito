'use client'
import React from 'react'
import Input from '../Input'
import DatePicker from '../DatePicker'
import TimePicker from '../TimePicker'
import Autocomplete from '../Autocomplete'
import useSWR from 'swr'
import { getVicenteLopez } from '@/services'

const AutosForm = [<FirstStep />, <SecondStep />]

function FirstStep() {
  const { data, isLoading } = useSWR('/api/localidades', getVicenteLopez)
  if (isLoading) return <div>Cargando...</div>
  return (
    <div className="flex w-full justify-between flex-wrap">
      <DatePicker name="fecha" label="Fecha" className="w-full basis-5/12" />
      <TimePicker name="hora" label="Hora" className="w-full basis-5/12" />
      <Input name="lugar" label="Lugar" className="w-full basis-5/12" />
      <Autocomplete
        name="localidad"
        label="Localidad"
        inputId="id_barrio"
        inputLabel="barrio"
        className="w-full basis-5/12"
        rules={{ required: 'Este campo es requerido' }}
        options={data!}
      />
    </div>
  )
}

function SecondStep() {
  return (
    <div className="flex w-full justify-between flex-wrap">
      <Input label="Placa" name="placa" className="w-full basis-5/12" />
      <Input label="Marca" name="marca" className="w-full basis-5/12" />
      <Input label="Modelo" name="modelo" className="w-full basis-5/12" />
      <Input label="Año" name="año" className="w-full basis-5/12" />
    </div>
  )
}

export default AutosForm
