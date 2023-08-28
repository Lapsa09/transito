'use client'
import React, { useEffect, useState } from 'react'
import AutoComplete from '@/components/Autocomplete'
import Input from '@/components/Input'
import { Radio, RadioGroup } from '@nextui-org/react'
import DateField from '../DatePicker'
import Switch from '../Switch'
import {
  FormProvider,
  SubmitHandler,
  UseFieldArrayRemove,
  useFieldArray,
  useForm,
  useFormContext,
} from 'react-hook-form'
import TimeField from '../TimePicker'
import { IoMdRemove } from 'react-icons/io'
import Button from '../Button'
import useSWR, { mutate } from 'swr'
import {
  getListaOperarios,
  getListaClientes,
  getPrecios,
  nuevoServicio,
} from '@/services'
import { ServiciosFormProps } from '@/types'
import Link from 'next/link'
import { toast } from '@/hooks'

function ServiciosForm() {
  const [medioPago, setMedioPago] = useState('recibo')
  const methods = useForm<ServiciosFormProps>()

  const { getValues, control, setValue, handleSubmit, reset } = methods

  const { data: clientes, isLoading } = useSWR('operarios', getListaClientes)

  const { cliente } = getValues()

  const { fields, append, remove } = useFieldArray<ServiciosFormProps>({
    control,
    name: 'operarios',
  })

  useEffect(() => {
    const importe_servicio = fields.reduce((acc, op) => acc + op.a_cobrar, 0)
    setValue('importe_servicio', importe_servicio)
  }, [fields])

  const onSubmit: SubmitHandler<ServiciosFormProps> = async (body) => {
    try {
      const req = await nuevoServicio({ body })
      toast({ title: req, variant: 'success' })
      reset()
    } catch (error: any) {
      toast({
        title: error.response.data || error.message,
        variant: 'destructive',
      })
    }
  }

  if (isLoading) return null
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-2"
      >
        <div className="flex w-5/6 justify-between flex-wrap gap-1">
          <AutoComplete
            label="Cliente"
            options={clientes!}
            name="cliente"
            inputId="id_cliente"
            inputLabel="cliente"
            className="w-full basis-5/12"
            rules={{ required: true }}
          />
          {cliente && (
            <>
              <RadioGroup
                orientation="horizontal"
                label="Medio de pago"
                value={medioPago}
                onValueChange={setMedioPago}
                className="w-full basis-5/12"
              >
                <Radio value="recibo">Recibo</Radio>
                <Radio value="acopio">Acopio</Radio>
              </RadioGroup>
              {medioPago === 'recibo' ? (
                <>
                  <Input
                    label="Recibo"
                    name="recibo"
                    rules={{ required: true }}
                    type="number"
                    className="w-full basis-5/12"
                  />
                  <DateField
                    label="Fecha del recibo"
                    name="fecha_recibo"
                    rules={{ required: true }}
                    className="w-full basis-5/12"
                  />
                  <Input
                    label="Importe del recibo"
                    name="importe_recibo"
                    rules={{ required: true }}
                    type="number"
                    className="w-full basis-5/12"
                  />
                </>
              ) : (
                <Input
                  label="Acopio"
                  name="acopio"
                  rules={{ required: true }}
                  type="number"
                  className="w-full basis-5/12"
                  disabled
                />
              )}
            </>
          )}

          <DateField
            label="Fecha del servicio"
            name="fecha_servicio"
            rules={{ required: true }}
            className="w-full basis-5/12"
          />
          <Switch
            label="Es feriado?"
            name="feriado"
            className="w-full basis-5/12"
          />
        </div>
        <div className="flex flex-col items-center flex-wrap gap-2 w-11/12">
          <h3 className="text-lg font-semibold">Operarios</h3>
          <Button
            className="w-1/4"
            onClick={() =>
              append({
                operario: undefined,
                hora_inicio: '',
                hora_fin: '',
                a_cobrar: 0,
              })
            }
          >
            Agregar operario
          </Button>
          {fields.map((field, index) => (
            <OperarioForm index={index} key={field.id} remove={remove} />
          ))}
        </div>
        <Input
          label="Importe del servicio"
          name="importe_servicio"
          type="number"
          className="w-1/4"
          placeholder="0"
          isDisabled
        />
        <div className="flex">
          <Link href="/sueldos">
            <Button className="bg-danger">Cancelar</Button>
          </Link>
          <Button type="submit">Crear servicio</Button>
        </div>
      </form>
    </FormProvider>
  )
}

function OperarioForm({
  index,
  remove,
}: {
  index: number
  remove: UseFieldArrayRemove
}) {
  const { setValue, watch } = useFormContext<ServiciosFormProps>()
  const { data: operarios } = useSWR('operarios', getListaOperarios)
  const { data: precios } = useSWR('precios', getPrecios)
  const { feriado, fecha_servicio, operarios: watchOps } = watch()
  const field = watchOps[index]

  const getImporteOperario = ({
    dia,
    inicio,
    fin,
    importe,
    isFeriado,
    precios,
  }: {
    dia: Date
    inicio: string
    fin: string
    importe: number
    isFeriado?: boolean
    precios?: { id: string; precio: number }[]
  }) => {
    if (!dia || !inicio || !fin || !precios) {
      return importe
    }
    const fecha_servicio = new Date(dia)
    const hora_inicio = new Date(fecha_servicio.toDateString() + ' ' + inicio)
    const hora_fin = new Date(fecha_servicio.toDateString() + ' ' + fin)

    if (
      isNaN(hora_inicio.getMilliseconds()) ||
      isNaN(hora_fin.getMilliseconds())
    ) {
      return importe ?? 0
    }

    const [precio_normal, precio_pico] = precios

    const diff = hora_fin.getHours() - hora_inicio.getHours()
    if (
      fecha_servicio.getDay() >= 1 &&
      fecha_servicio.getDay() <= 5 &&
      !isFeriado
    ) {
      if (hora_inicio?.getHours() >= 8 && hora_inicio?.getHours() <= 20) {
        return precio_normal.precio * diff
      }
    }
    return precio_pico.precio * diff
  }

  useEffect(() => {
    const importe = getImporteOperario({
      dia: fecha_servicio,
      inicio: field.hora_inicio,
      fin: field.hora_fin,
      importe: field.a_cobrar,
      isFeriado: feriado,
      precios,
    })

    setValue(`operarios.${index}.a_cobrar`, importe)
  }, [field.hora_inicio, field.hora_fin, feriado, fecha_servicio, precios])

  useEffect(() => {
    const importe_servicio = watchOps.reduce((acc, op) => acc + op.a_cobrar, 0)
    setValue('importe_servicio', importe_servicio)
  }, [field.a_cobrar])

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
        <AutoComplete
          label="Operario"
          options={operarios!}
          inputId="legajo"
          inputLabel="nombre"
          name={`operarios.${index}.operario`}
          className="w-full basis-5/12"
          rules={{ required: true }}
        />
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
          rules={{ required: true }}
          placeholder="0"
          className="w-full basis-5/12"
          type="number"
          isDisabled
        />
      </div>
    </div>
  )
}

export default ServiciosForm
