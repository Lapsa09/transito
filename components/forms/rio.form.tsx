'use client'
import AutoComplete from '@/components/Autocomplete'
import DateField from '@/components/DatePicker'
import Input from '@/components/Input'
import Select from '@/components/Select'
import TimeField from '@/components/TimePicker'
import { LocalOperativo } from '@/types'
import { setExpiration } from '@/utils/misc'
import { turnos, zonas } from '@prisma/client'
import React from 'react'
import { useLocalStorage } from 'usehooks-ts'

export function FirstStep({
  selects,
}: {
  selects: {
    turnos: { id: turnos; label: string }[]
  }
}) {
  const { turnos } = selects

  const [, edit] = useLocalStorage<LocalOperativo>('rio', {
    expiresAt: 0,
  })

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
        rules={{
          required: 'Este campo es requerido',
          validate: {
            maxDate: (value) => {
              const date = new Date(value)
              const maxDate = new Date()
              return value
                ? date <= maxDate ||
                    'La fecha no debe ser posterior a la fecha actual'
                : true
            },
          },
        }}
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

export function SecondStep({
  selects,
}: {
  selects: {
    zonasPaseo: zonas[]
  }
}) {
  const { zonasPaseo } = selects

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
