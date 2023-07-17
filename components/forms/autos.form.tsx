'use client'
import React, { useEffect } from 'react'
import Input from '../Input'
import DatePicker from '../DatePicker'
import TimePicker from '../TimePicker'
import useSWR from 'swr'
import { getSelects } from '@/services'
import Select from '../Select'
import { useFormContext } from 'react-hook-form'
import { useLocalStorage } from 'usehooks-ts'
import { resolucion as IResolucion } from '@prisma/client'
import Autocomplete from '../Autocomplete'

const AutosForm = [<FirstStep />, <SecondStep />]

function FirstStep() {
  const { data } = useSWR('/api/selects', getSelects)
  const { vicenteLopez, turnos, seguridad } = data!

  const [, edit] = useLocalStorage('autos', {})

  const setOperativo = (value: any) => {
    edit((state) => ({ ...state, ...value }))
  }

  return (
    <div className="flex w-full justify-between flex-wrap">
      <DatePicker
        name="fecha"
        label="Fecha"
        className="w-full basis-5/12"
        rules={{ required: 'Este campo es requerido' }}
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
        name="direccion"
        label="Direccion"
        className="w-full basis-5/12"
        rules={{ required: 'Este campo es requerido' }}
        persist={setOperativo}
      />
      <Autocomplete
        name="zona"
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

function SecondStep() {
  const { getValues, setValue } = useFormContext()
  const { data } = useSWR('/api/selects', getSelects)

  const esSancionable =
    getValues('resolucion') === IResolucion.ACTA ||
    getValues('resolucion') === IResolucion.REMITIDO

  const { licencias, motivos, resolucion, zonas } = data!

  useEffect(() => {
    if (!esSancionable) {
      setValue('motivo', null)
      setValue('acta', null)
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

export default AutosForm
