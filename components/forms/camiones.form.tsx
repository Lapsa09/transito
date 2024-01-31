'use client'
import React, { useEffect } from 'react'
import Input from '@/components/Input'
import DatePicker from '@/components/DatePicker'
import TimePicker from '@/components/TimePicker'
import Autocomplete from '@/components/Autocomplete'
import Switch from '@/components/Switch'
import Select from '@/components/Select'
import { useFormContext } from 'react-hook-form'
import { useLocalStorage } from 'usehooks-ts'
import {
  resolucion as IResolucion,
  barrios,
  motivos,
  turnos,
  vicente_lopez,
} from '@prisma/client'
import { FormCamionesProps, LocalOperativo } from '@/types'
import { setExpiration } from '@/utils/misc'

export function FirstStep({
  selects,
}: {
  selects: {
    vicenteLopez: vicente_lopez[]
    turnos: { id: turnos; label: string }[]
  }
}) {
  const [, edit] = useLocalStorage<LocalOperativo>('camiones', {
    expiresAt: 0,
  })
  const setOperativo = (value: any) => {
    edit((state) => ({
      ...state,
      ...value,
      expiresAt: state.expiresAt || setExpiration(),
    }))
  }

  const { vicenteLopez, turnos } = selects
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
      <Input
        name="qth"
        label="Direccion"
        className="w-full basis-5/12"
        rules={{ required: 'Este campo es requerido' }}
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
      <Input.Legajo
        name="legajo"
        label="Legajo"
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
    </div>
  )
}

export function SecondStep({
  selects,
}: {
  selects: {
    motivos: motivos[]
    resolucion: { id: IResolucion; label: string }[]
    zonas: barrios[]
  }
}) {
  const { watch, resetField } = useFormContext<FormCamionesProps>()
  console.log(selects)
  const esSancionable =
    watch('resolucion') === IResolucion.ACTA ||
    watch('resolucion') === IResolucion.REMITIDO

  const { motivos, resolucion, zonas } = selects

  useEffect(() => {
    if (!esSancionable) {
      resetField('motivo')
      resetField('acta')
    }
  }, [esSancionable])

  return (
    <div className="flex w-full justify-between flex-wrap">
      <TimePicker
        name="hora"
        label="Hora"
        className="w-full basis-5/12"
        rules={{ required: 'Este campo es requerido' }}
      />
      <Input.Dominio
        label="Dominio"
        name="dominio"
        className="w-full basis-5/12"
      />
      <Input label="Origen" name="origen" className="w-full basis-5/12" />
      <Autocomplete
        name="localidad_origen"
        label="Localidad de origen"
        options={zonas}
        inputId="id_barrio"
        inputLabel="barrio"
        className="w-full basis-5/12"
        rules={{ required: 'Este campo es requerido' }}
      />
      <Input label="Destino" name="destino" className="w-full basis-5/12" />
      <Autocomplete
        name="localidad_destino"
        label="Localidad de destino"
        options={zonas}
        inputId="id_barrio"
        inputLabel="barrio"
        className="w-full basis-5/12"
        rules={{ required: 'Este campo es requerido' }}
      />
      <Input label="Licencia" name="licencia" className="w-full basis-5/12" />
      <div>
        <Switch label="Remito" name="remito" />
        <Switch label="Carga" name="carga" />
      </div>
      <Select
        name="resolucion"
        label="Resolucion"
        options={resolucion}
        className="w-full basis-5/12"
      />
      {esSancionable && (
        <>
          <Input
            label="Nº acta"
            name="acta"
            className="w-full basis-5/12"
            rules={{ required: 'Este campo es requerido' }}
          />
          <Autocomplete
            label="Motivo"
            name="motivos"
            options={motivos}
            inputId="id_motivo"
            inputLabel="motivo"
            className="w-full basis-5/12"
            rules={{ required: 'Este campo es requerido' }}
          />
        </>
      )}
    </div>
  )
}
