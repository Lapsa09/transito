'use client'
import React, { useEffect } from 'react'
import Input from '@/components/Input'
import DatePicker from '@/components/DatePicker'
import TimePicker from '@/components/TimePicker'
import Select from '@/components/Select'
import { useFormContext } from 'react-hook-form'
import { useLocalStorage } from 'usehooks-ts'
import type {
  resolucion as IResolucion,
  tipo_licencias,
  seguridad,
  turnos,
  vicente_lopez,
  motivos,
  barrios,
} from '@prisma/client'
import Autocomplete from '@/components/Autocomplete'
import { FormAutosProps, LocalOperativo } from '@/types'
import { setExpiration } from '@/utils/misc'

export function FirstStep({
  selects,
}: {
  selects: {
    vicenteLopez: vicente_lopez[]
    turnos: { id: turnos; label: string }[]
    seguridad: { id: seguridad; label: string }[]
  }
}) {
  const { vicenteLopez, turnos, seguridad } = selects

  const [, edit] = useLocalStorage<LocalOperativo>('autos', {
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
      <DatePicker
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
      <TimePicker
        name="hora"
        label="Hora"
        className="w-full basis-5/12"
        rules={{ required: 'Este campo es requerido' }}
        persist={setOperativo}
      />
      <Input.Legajo
        name="legajo_a_cargo"
        label="Legajo a cargo"
        className="w-full basis-5/12"
        persist={setOperativo}
      />
      <Input.Legajo
        name="legajo_planilla"
        label="Legajo planilla"
        className="w-full basis-5/12"
        persist={setOperativo}
      />
      <Select
        name="turno"
        label="Turno"
        className="w-full basis-5/12"
        options={turnos}
        rules={{ required: 'Este campo es requerido' }}
        persist={setOperativo}
      />
      <Select
        name="seguridad"
        label="Seguridad"
        className="w-full basis-5/12"
        options={seguridad}
        rules={{ required: 'Este campo es requerido' }}
        persist={setOperativo}
      />
      <Input
        name="qth"
        label="Direccion"
        className="w-full basis-5/12"
        rules={{ required: 'Este campo es requerido' }}
        placeholder='Ej: "Av. Maipu 1234"'
        persist={setOperativo}
      />
      <Autocomplete
        name="localidad"
        label="Zona"
        inputId="id_barrio"
        inputLabel="barrio"
        className="w-full basis-5/12"
        rules={{ required: 'Este campo es requerido' }}
        options={vicenteLopez}
        persist={setOperativo}
      />
    </div>
  )
}

export function SecondStep({
  selects,
}: {
  selects: {
    licencias: tipo_licencias[]
    motivos: motivos[]
    resolucion: { id: IResolucion; label: string }[]
    zonas: barrios[]
  }
}) {
  const { watch, resetField } = useFormContext<FormAutosProps>()

  const esSancionable =
    watch('resolucion') === 'ACTA' || watch('resolucion') === 'REMITIDO'

  const { licencias, motivos, resolucion, zonas } = selects

  useEffect(() => {
    if (!esSancionable) {
      resetField('motivo')
      resetField('acta')
    }
  }, [esSancionable])

  return (
    <div className="flex w-full justify-between flex-wrap">
      <Input.Dominio
        label="Dominio"
        name="dominio"
        className="w-full basis-5/12"
      />
      <Input
        label="Nº licencia"
        name="licencia"
        className="w-full basis-5/12"
        placeholder='Ej: "12345678"'
      />
      <Autocomplete
        name="tipo_licencia"
        label="Tipo licencia"
        options={licencias}
        inputId="id_tipo"
        inputLabel="tipo"
        className="w-full basis-5/12"
      />
      <Autocomplete
        name="zona_infractor"
        label="Zona infractor"
        options={zonas}
        inputId="id_barrio"
        inputLabel="barrio"
        className="w-full basis-5/12"
        rules={{ required: 'Este campo es requerido' }}
      />
      <Input
        name="graduacion_alcoholica"
        label="Graduacion Alcoholica"
        className="w-full basis-5/12"
        type="number"
        placeholder='Ej: "0.0"'
      />
      <Select
        name="resolucion"
        label="Resolucion"
        options={resolucion}
        className="w-full basis-5/12"
      />
      {esSancionable && (
        <>
          <Autocomplete
            label="Motivo"
            name="motivo"
            options={motivos}
            inputId="id_motivo"
            inputLabel="motivo"
            className="w-full basis-5/12"
            rules={{ required: 'Este campo es requerido' }}
          />
          <Input
            label="Nº acta"
            name="acta"
            className="w-full basis-5/12"
            rules={{ required: 'Este campo es requerido' }}
          />
        </>
      )}
    </div>
  )
}
