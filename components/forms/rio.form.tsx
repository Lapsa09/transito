'use client'
import { getSelects } from '@/services'
import React from 'react'
import useSWR from 'swr'
import DateField from '../DatePicker'
import { useLocalStorage } from 'usehooks-ts'
import { LocalOperativo } from '@/types'
import Input from '../Input'
import { setExpiration } from '@/utils/misc'
import Select from '../Select'
import AutoComplete from '../Autocomplete'
import TimeField from '../TimePicker'

export const steps = [<FirstStep />, <SecondStep />]

function FirstStep() {
  const { data } = useSWR('/api/selects', getSelects)

  const { turnos } = data!

  const [op, edit] = useLocalStorage<LocalOperativo>('rio', {
    expiresAt: 0,
  })
  console.log({ op })
  const setOperativo = (value: any) => {
    edit((state) => ({
      ...state,
      ...value,
      expiresAt: state.expiresAt || setExpiration(),
    }))
  }

  return (
    <div className="flex w-full justify-between flex-wrap">
      <DateField
        name="fecha"
        label="Fecha"
        className="w-full basis-5/12"
        rules={{ required: 'Este campo es requerido' }}
        persist={setOperativo}
      />
      <TimeField
        name="hora"
        label="Hora"
        className="w-full basis-5/12"
        persist={setOperativo}
      />
      <Input.Legajo
        name="lp"
        label="Legajo"
        className="w-full basis-5/12"
        rules={{ required: 'Este campo es requerido' }}
        persist={setOperativo}
      />
      <Select
        name="turno"
        label="Turno"
        className="w-full basis-5/12"
        options={turnos}
        persist={setOperativo}
      />
    </div>
  )
}

function SecondStep() {
  const { data } = useSWR('/api/selects', getSelects)

  const { zonasPaseo } = data!

  return (
    <div className="flex w-full justify-between flex-wrap">
      <Input.Dominio
        name="dominio"
        label="Dominio"
        className="w-full basis-5/12"
      />
      <AutoComplete
        name="zona"
        label="Zona"
        className="w-full basis-5/12"
        options={zonasPaseo}
      />
    </div>
  )
}
