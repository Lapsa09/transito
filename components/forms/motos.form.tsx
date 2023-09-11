'use client'
import React, { useEffect } from 'react'
import Input from '../Input'
import DatePicker from '../DatePicker'
import TimePicker from '../TimePicker'
import Autocomplete from '../Autocomplete'
import useSWR from 'swr'
import { getSelects } from '@/services'
import Select from '../Select'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { IoMdAdd, IoMdRemove } from 'react-icons/io'
import { useLocalStorage } from 'usehooks-ts'
import { resolucion as IResolucion } from '@prisma/client'
import { setExpiration } from '@/utils/misc'
import { LocalOperativo } from '@/types'

export const steps = [<FirstStep />, <SecondStep />]

function FirstStep() {
  const { data } = useSWR('/api/selects', getSelects)

  const [, edit] = useLocalStorage<LocalOperativo>('motos', {
    expiresAt: 0,
  })

  const setOperativo = (value: any) => {
    edit((state) => ({
      ...state,
      ...value,
      expiresAt: state.expiresAt || setExpiration(),
    }))
  }

  const { vicenteLopez, turnos, seguridad } = data!
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
    </div>
  )
}

function SecondStep() {
  const { watch, setValue } = useFormContext()
  const { fields, append, remove } = useFieldArray({ name: 'motivos' })
  const { data } = useSWR('/api/selects', getSelects)

  const esSancionable =
    watch('resolucion') === IResolucion.ACTA ||
    watch('resolucion') === IResolucion.REMITIDO

  const sumarMotivos = () => {
    if (fields.length < 5) {
      append({ id_motivo: null, motivo: '' })
    }
  }

  const restarMotivos = () => {
    if (fields.length > 1) {
      remove(-1)
    }
  }

  const { licencias, motivos, resolucion, zonas } = data!

  useEffect(() => {
    if (fields.length === 0) sumarMotivos()
    if (!esSancionable) {
      setValue('motivo', null)
      setValue('acta', null)
    }
  }, [esSancionable])

  return (
    <div className="flex w-full justify-between flex-wrap">
      {esSancionable && (
        <div className="flex justify-center items-center basis-full gap-2">
          <IoMdRemove
            className="cursor-pointer text-3xl"
            onClick={restarMotivos}
          />
          <h4>Motivos: {fields.length}</h4>
          <IoMdAdd className="cursor-pointer text-3xl" onClick={sumarMotivos} />
        </div>
      )}
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
      <Select
        name="resolucion"
        label="Resolucion"
        options={resolucion}
        className="w-full basis-5/12"
      />
      {esSancionable && (
        <>
          {fields.map((item, index) => (
            <Autocomplete
              key={item.id}
              label={'Motivo ' + (index + 1)}
              name={'motivos.' + index}
              options={motivos}
              inputId="id_motivo"
              inputLabel="motivo"
              className="w-full basis-5/12"
              rules={{ required: 'Este campo es requerido' }}
            />
          ))}
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
