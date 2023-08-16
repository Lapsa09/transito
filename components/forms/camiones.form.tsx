'use client'
import React, { useEffect } from 'react'
import Input from '../Input'
import DatePicker from '../DatePicker'
import TimePicker from '../TimePicker'
import Autocomplete from '../Autocomplete'
import Switch from '../Switch'
import Select from '../Select'
import useSWR from 'swr'
import { getSelects } from '@/services'
import { useFormContext } from 'react-hook-form'
import { useLocalStorage } from 'usehooks-ts'
import { resolucion as IResolucion } from '@prisma/client'
import { LocalOperativo } from '@/types'
import { setExpiration } from '@/utils/misc'

export const steps = [<FirstStep />, <SecondStep />]

function FirstStep() {
  const { data } = useSWR('/api/selects', getSelects)
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

  const { vicenteLopez, turnos } = data!
  return (
    <div className="flex w-full justify-between flex-wrap">
      <DatePicker
        name="fecha"
        label="Fecha"
        className="w-full basis-5/12"
        rules={{ required: 'Este campo es requerido' }}
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

function SecondStep() {
  const { getValues, setValue } = useFormContext()
  const { data } = useSWR('/api/selects', getSelects)

  const esSancionable =
    getValues('resolucion') === IResolucion.ACTA ||
    getValues('resolucion') === IResolucion.REMITIDO

  const { motivos, resolucion, zonas } = data!

  useEffect(() => {
    if (!esSancionable) {
      setValue('motivo', null)
      setValue('acta', null)
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
