'use client'

import React from 'react'
import DateField from '@/components/DatePicker'
import CustomInput from '@/components/Input'
import CustomSelect from '@/components/Select'
import TimeField from '@/components/TimePicker'
import Autocomplete from '@/components/Autocomplete'
import { turnos } from '@prisma/client'
import { useFormContext } from 'react-hook-form'
import { useLocalStorage } from 'usehooks-ts'
import { setExpiration } from '@/utils/misc'

export function FirstStep() {
  const [, edit] = useLocalStorage<{
    fecha?: string
    turno?: turnos
    qth?: string
    expiresAt: number
  }>('partes', {
    expiresAt: 0,
  })

  const setParte = (value: any) => {
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
        rules={{
          required: 'Valor requerido',
        }}
        className="w-full basis-5/12"
        persist={setParte}
      />
      <CustomSelect
        name="turno"
        label="Turno"
        className="w-full basis-5/12"
        options={[
          { label: 'MAÑANA', id: 'MA_ANA' },
          { label: 'TARDE', id: 'TARDE' },
          { label: 'NOCHE', id: 'NOCHE' },
        ]}
        rules={{
          required: 'Valor requerido',
        }}
        persist={setParte}
      />
      <CustomInput
        name="qth"
        label="QTH"
        className="w-full basis-5/12"
        rules={{
          required: 'Valor requerido',
        }}
        persist={setParte}
      />
    </div>
  )
}

export const SecondStep = ({
  operarios,
}: {
  operarios: { legajo: string; nombre: string }[]
}) => {
  const form = useFormContext()

  return (
    <div className="flex w-full justify-between flex-wrap">
      <CustomInput
        name="movil"
        className="w-full basis-5/12"
        label="Movil"
        rules={{
          required: 'Valor requerido',
        }}
      />
      <Autocomplete
        name="operario"
        label="Operario"
        className="w-full basis-5/12"
        options={operarios}
        rules={{
          required: 'Valor requerido',
        }}
        inputId="legajo"
        inputLabel={(option) => (option.nombre ? 'nombre' : 'legajo')}
      />
      <TimeField
        name="hora_inicio"
        label="Hora de Inicio"
        className="w-full basis-5/12"
        rules={{
          required: 'Valor requerido',
        }}
      />
      <TimeField
        name="hora_fin"
        label="Hora de Fin"
        className="w-full basis-5/12"
        rules={{
          validate: (value) => {
            if (value < form.getValues('hora_inicio')) {
              return 'La hora de fin no puede ser menor a la hora de inicio'
            }
          },
          required: 'Valor requerido',
        }}
        defaultValue={
          form.getValues('hora_inicio') &&
          new Date(form.getValues('hora_inicio')).setHours(
            new Date(form.getValues('hora_inicio')).getHours() + 1,
          )
        }
      />
      <TimeField
        name="hora_descanso"
        className="w-full basis-5/12"
        label="Hora de Descanso"
        rules={{
          required: 'Valor requerido',
        }}
      />
      <TimeField
        name="hora_descanso_fin"
        className="w-full basis-5/12"
        label="Hora de Fin de Descanso"
        rules={{
          required: 'Valor requerido',
          validate: (value) => {
            if (value < form.getValues('hora_descanso')) {
              return 'La hora de fin de descanso no puede ser menor a la hora de descanso'
            }
          },
        }}
        defaultValue={
          form.getValues('hora_descanso') &&
          new Date(form.getValues('hora_descanso')).setHours(
            new Date(form.getValues('hora_descanso')).getHours() + 1,
          )
        }
      />
    </div>
  )
}
