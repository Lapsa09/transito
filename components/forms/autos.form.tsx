'use client'
import React, { useEffect } from 'react'
import Input from '@/components/Input'
import DatePicker from '@/components/DatePicker'
import TimePicker from '@/components/TimePicker'
import Select from '@/components/Select'
import { FormProvider, useForm } from 'react-hook-form'
import { useLocalStorage } from 'usehooks-ts'
import {
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
import { setter } from '@/services'
import { Registro } from '@/types/autos'
import { toast, useStepForm } from '@/hooks'
import { Button } from '@nextui-org/react'
import { DEFAULT_OPERATIVO_AUTO } from '@/utils/localOperativos'

type FormProps = NonNullable<typeof DEFAULT_OPERATIVO_AUTO>

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

  const [operativo, edit] = useLocalStorage<typeof DEFAULT_OPERATIVO_AUTO>(
    'autos',
    DEFAULT_OPERATIVO_AUTO,
  )
  const formProps = useForm<FormProps>({
    defaultValues: operativo,
  })

  const setOperativo = (value: any) => {
    edit((state) => ({
      ...state,
      ...value,
      expiresAt: state.expiresAt || setExpiration(),
    }))
  }

  const { setActiveStep } = useStepForm()

  useEffect(() => {
    setOperativo(formProps.getValues())
  }, [formProps.watch()])

  const handleSubmit = (body: FormProps) => {
    setOperativo(body)
    setActiveStep(1)
  }

  return (
    <FormProvider {...formProps}>
      <form
        onSubmit={formProps.handleSubmit(handleSubmit)}
        className="flex w-full justify-between flex-wrap"
      >
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
        />
        <TimePicker
          name="hora"
          label="Hora"
          className="w-full basis-5/12"
          rules={{ required: 'Este campo es requerido' }}
        />
        <Input.Legajo
          name="legajo_a_cargo"
          label="Legajo a cargo"
          className="w-full basis-5/12"
        />
        <Input.Legajo
          name="legajo_planilla"
          label="Legajo planilla"
          className="w-full basis-5/12"
        />
        <Select
          name="turno"
          label="Turno"
          className="w-full basis-5/12"
          options={turnos}
          rules={{ required: 'Este campo es requerido' }}
        />
        <Select
          name="seguridad"
          label="Seguridad"
          className="w-full basis-5/12"
          options={seguridad}
          rules={{ required: 'Este campo es requerido' }}
        />
        <Input
          name="qth"
          label="Direccion"
          className="w-full basis-5/12"
          rules={{ required: 'Este campo es requerido' }}
          placeholder='Ej: "Av. Maipu 1234"'
        />
        <Autocomplete
          name="localidad"
          label="Zona"
          inputId="id_barrio"
          inputLabel="barrio"
          className="w-full basis-5/12"
          rules={{ required: 'Este campo es requerido' }}
          options={vicenteLopez}
        />
        <div className="flex justify-between w-full">
          <Button disabled>Atras</Button>

          <Button disabled={!formProps.formState.isValid} type="submit">
            Siguiente
          </Button>
        </div>
      </form>
    </FormProvider>
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
  const formProps = useForm<FormAutosProps>()
  const { setActiveStep } = useStepForm()

  const esSancionable =
    formProps.watch('resolucion') === IResolucion.ACTA ||
    formProps.watch('resolucion') === IResolucion.REMITIDO

  const { licencias, motivos, resolucion, zonas } = selects

  const [operativo] = useLocalStorage<typeof DEFAULT_OPERATIVO_AUTO>(
    'autos',
    DEFAULT_OPERATIVO_AUTO,
  )

  useEffect(() => {
    if (!esSancionable) {
      formProps.resetField('motivo')
      formProps.resetField('acta')
    }
  }, [esSancionable])

  const handleSubmit = async (body: FormAutosProps) => {
    try {
      await setter<Registro>({
        route: `/operativos/autos`,
        body: { ...body, ...operativo },
      })
      toast({ title: 'Operativo creado con exito', variant: 'success' })

      formProps.reset()

      formProps.setFocus('dominio')
    } catch (error: any) {
      toast({
        title: error.response?.data || error.message,
        variant: 'destructive',
      })
    }
  }

  return (
    <FormProvider {...formProps}>
      <form
        onSubmit={formProps.handleSubmit(handleSubmit)}
        className="flex w-full justify-between flex-wrap"
      >
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
        <div className="flex justify-between w-full">
          <Button onClick={() => setActiveStep(0)}>Atras</Button>

          <Button disabled={!formProps.formState.isValid} type="submit">
            Guardar
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
