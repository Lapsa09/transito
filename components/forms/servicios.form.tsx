'use client'
import React, { useEffect } from 'react'
import AutoComplete from '../Autocomplete'
import Input from '../Input'
import DateField from '../DatePicker'
import Switch from '../Switch'
import {
  UseFieldArrayRemove,
  useFieldArray,
  useFormContext,
} from 'react-hook-form'
import TimeField from '../TimePicker'
import { IoMdRemove } from 'react-icons/io'
import { Button } from '../ui/button'
import { ServiciosFormProps } from '@/types'
import { NuevoCliente, NuevoOperario } from '../MiniModals'
import { DateTime, Interval } from 'luxon'
import { Clientes, Operarios, Precios } from '@/drizzle/schema/sueldos'

function LayoutServiciosForm({
  selects,
  precios,
}: {
  selects: {
    clientes: Array<Clientes & { acopio: number }>
    operarios: Operarios[]
  }
  precios: Precios[]
}) {
  const { control, setValue, watch, getValues, resetField } =
    useFormContext<ServiciosFormProps>()

  const { hay_recibo } = watch()
  const { cliente } = getValues()

  const { fields, append, remove } = useFieldArray<ServiciosFormProps>({
    control,
    name: 'operarios',
  })

  useEffect(() => {
    const importe_servicio = fields.reduce(
      (acc, op) => acc + (op.a_cobrar ?? 0),
      0,
    )
    setValue('importe_servicio', importe_servicio)
  }, [fields])

  useEffect(() => {
    if (cliente) {
      setValue('acopio', cliente.acopio)
    } else {
      resetField('acopio')
    }
  }, [cliente])

  useEffect(() => {
    if (!hay_recibo) {
      resetField('recibo')
      resetField('fecha_recibo')
      resetField('importe_recibo')
    }
  }, [hay_recibo])

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex w-5/6 justify-between flex-wrap gap-1">
        <div className="flex w-full basis-5/12 items-end pb-6">
          <AutoComplete
            label="Cliente"
            options={selects.clientes}
            name="cliente"
            inputId="id_cliente"
            inputLabel="cliente"
            className="w-full p-0"
            rules={{ required: true }}
          />
          <NuevoCliente />
        </div>
        {cliente && (
          <>
            <Switch
              label="Desea agregar un recibo?"
              name="hay_recibo"
              className="w-full basis-5/12"
            />
            <Input
              label="Recibo"
              name="recibo"
              rules={{ required: hay_recibo }}
              type="number"
              className="w-full basis-5/12"
              isDisabled={!hay_recibo}
            />
            <DateField
              label="Fecha del recibo"
              name="fecha_recibo"
              rules={{ required: hay_recibo }}
              className="w-full basis-5/12"
              isDisabled={!hay_recibo}
            />
            <Input
              label="Importe del recibo"
              name="importe_recibo"
              rules={{ required: hay_recibo }}
              type="number"
              className="w-full basis-5/12"
              startContent="$"
              isDisabled={!hay_recibo}
            />

            <Input
              label="Acopio"
              name="acopio"
              type="number"
              placeholder="0"
              className="w-full basis-5/12"
              isDisabled
              startContent="$"
            />
          </>
        )}
        <div className="flex w-full basis-5/12">
          <DateField
            label="Fecha del servicio"
            name="fecha_servicio"
            rules={{ required: true }}
            className="w-full"
          />
          <Switch label="Es feriado?" name="feriado" className="w-full ml-2" />
        </div>
        <Input
          name="memo"
          label="Memo"
          className="w-full basis-5/12"
          placeholder="0000/00"
        />
      </div>
      <div className="flex flex-col items-center flex-wrap gap-2 w-11/12">
        <h3 className="text-lg font-semibold">Operarios</h3>
        <Button
          className="w-1/4"
          onClick={() =>
            append({
              hora_inicio: '',
              hora_fin: '',
              a_cobrar: 0,
              cancelado: false,
            })
          }
        >
          Agregar operario
        </Button>
        {fields.map((field, index) => (
          <OperarioForm
            index={index}
            key={field.id}
            remove={remove}
            operarios={selects.operarios}
            precios={precios}
          />
        ))}
      </div>
      <Input
        label="Importe del servicio"
        name="importe_servicio"
        type="number"
        className="w-1/4"
        placeholder="0"
        startContent="$"
        isDisabled
      />
    </div>
  )
}

function OperarioForm({
  index,
  remove,
  operarios,
  precios,
}: {
  index: number
  remove: UseFieldArrayRemove
  operarios: Operarios[]
  precios: Precios[]
}) {
  const { setValue, watch } = useFormContext<ServiciosFormProps>()
  const { feriado, fecha_servicio, operarios: watchOps = [] } = watch()
  const field = watchOps[index]

  const getImporteOperario = ({
    dia,
    inicio,
    fin,
    importe,
    isFeriado,
    precios,
  }: {
    dia: string
    inicio: string
    fin: string
    importe: number
    isFeriado?: boolean
    precios: { id: string; precio: number }[]
  }) => {
    if (!dia || !inicio || !fin) {
      return importe
    }

    const fecha_servicio = DateTime.fromFormat(dia, 'yyyy-MM-dd')
    const hora_inicio = fecha_servicio.set({
      hour: parseInt(inicio.split(':')[0]),
      minute: parseInt(inicio.split(':')[1]),
    })
    const hora_fin = fecha_servicio.set({
      hour: parseInt(fin.split(':')[0]),
      minute: parseInt(fin.split(':')[1]),
    })

    if (hora_fin.hour < hora_inicio.hour) hora_fin.plus({ day: 1 })

    if (!hora_inicio.isValid || !hora_fin.isValid) {
      return importe ?? 0
    }

    const [{ precio: precio_normal }, { precio: precio_pico }] = precios

    const horario_servicio = Interval.fromDateTimes(hora_inicio, hora_fin)
    const diff = horario_servicio.toDuration('hours').hours
    if (
      fecha_servicio.weekday >= 1 &&
      fecha_servicio.weekday <= 5 &&
      !isFeriado
    ) {
      const horario_normal = Interval.fromDateTimes(
        fecha_servicio.set({ hour: 8, minute: 0 }),
        fecha_servicio.set({ hour: 20, minute: 0 }),
      )
      if (horario_normal.engulfs(horario_servicio)) {
        return precio_normal * diff
      }
      const horario_pico = Interval.fromDateTimes(
        fecha_servicio.set({ hour: 20, minute: 0 }),
        fecha_servicio.plus({ day: 1 }).set({ hour: 8 }),
      )
      const horario_normal_servicio =
        horario_servicio.intersection(horario_normal)
      const horario_pico_servicio = horario_pico.intersection(horario_servicio)
      const diff_normal = horario_normal_servicio?.length('hours')
      const diff_pico = horario_pico_servicio?.length('hours')
      const importe_normal = precio_normal * diff_normal!
      const importe_pico = precio_pico * diff_pico!
      return importe_normal + importe_pico
    }
    return precio_pico * diff
  }

  useEffect(() => {
    if (field?.operario && field?.operario?.legajo === 1) {
      setValue(`operarios.${index}.a_cobrar`, 0)
    } else {
      const importe = getImporteOperario({
        dia: fecha_servicio,
        inicio: field?.hora_inicio,
        fin: field?.hora_fin,
        importe: field?.a_cobrar,
        isFeriado: feriado,
        precios,
      })

      setValue(`operarios.${index}.a_cobrar`, importe)
    }
  }, [
    field?.hora_inicio,
    field?.hora_fin,
    feriado,
    fecha_servicio,
    precios,
    field?.operario,
  ])

  useEffect(() => {
    const importe_servicio = watchOps.reduce((acc, op) => acc + op.a_cobrar, 0)
    setValue('importe_servicio', importe_servicio)
  }, [field?.a_cobrar])

  return (
    <div
      className={`py-2 flex justify-evenly items-center w-full ${
        index % 2 === 0 ? '' : 'bg-gray-100'
      }`}
    >
      <IoMdRemove
        className="cursor-pointer w-10 h-10 hover:bg-gray-200 rounded-full"
        onClick={() => remove(index)}
      />
      <div className={'flex justify-between flex-wrap w-5/6'}>
        <div className="flex w-full basis-5/12 items-end pb-6">
          <AutoComplete
            label="Operario"
            options={operarios}
            inputId="legajo"
            inputLabel="nombre"
            name={`operarios.${index}.operario`}
            className="w-full p-0"
          />
          <NuevoOperario />
        </div>
        <TimeField
          label="Hora de inicio"
          name={`operarios.${index}.hora_inicio`}
          className="w-full basis-5/12"
          rules={{ required: true }}
        />
        <TimeField
          label="Hora de finalizacion"
          name={`operarios.${index}.hora_fin`}
          className="w-full basis-5/12"
          rules={{ required: true }}
        />
        <Input
          label="A cobrar"
          name={`operarios.${index}.a_cobrar`}
          placeholder="0"
          className="w-full basis-5/12"
          type="number"
          isDisabled
          startContent="$"
        />
      </div>
    </div>
  )
}

export default LayoutServiciosForm
