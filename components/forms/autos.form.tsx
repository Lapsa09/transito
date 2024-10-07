'use client'
import React, { useEffect } from 'react'
import Input from '@/components/Input'
import DatePicker from '@/components/DatePicker'
import TimePicker from '@/components/TimePicker'
import Select from '@/components/Select'
import { FormProvider, useForm } from 'react-hook-form'
import { useLocalStorage } from 'usehooks-ts'
import Autocomplete from '@/components/Autocomplete'
import { setExpiration } from '@/utils/misc'
import { setter, updater } from '@/services'
import { toast, useStepForm } from '@/hooks'
import { DEFAULT_OPERATIVO_AUTO } from '@/schemas/autos'
import { z } from 'zod'
import { operativoInputSchema, registroInputSchema } from '@/schemas/autos'
import {
  Barrio,
  controlSustancias,
  Motivo,
  resolucionSchema,
  seguridadSchema,
  TipoLicencia,
  turnosSchema,
  VicenteLopez,
} from '@/drizzle/schema/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '../ui'
import { useRouter } from 'next/navigation'

type FormProps = z.infer<typeof operativoInputSchema>

export function FirstStep({
  selects,
  editableOperativo,
}: {
  selects: {
    vicenteLopez: VicenteLopez[]
    turnos: Record<'id' | 'label', keyof typeof turnosSchema.enum>[]
    seguridad: Record<'id' | 'label', keyof typeof seguridadSchema.enum>[]
  }
  editableOperativo?: FormProps
}) {
  const { vicenteLopez, turnos, seguridad } = selects
  const [operativo, edit] = useLocalStorage<typeof DEFAULT_OPERATIVO_AUTO>(
    'autos',
    DEFAULT_OPERATIVO_AUTO,
  )
  const formProps = useForm<FormProps>({
    resolver: zodResolver(operativoInputSchema),
    defaultValues: { ...operativo, ...editableOperativo },
    mode: 'all',
  })

  const setOperativo = (value: any) => {
    edit((state) => ({
      ...state,
      ...value,
      expiresAt: setExpiration(),
    }))
  }

  const { setActiveStep } = useStepForm()

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
          persist={setOperativo}
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
          persist={setOperativo}
          className="w-full basis-5/12"
          rules={{ required: 'Este campo es requerido' }}
        />
        <Input.Legajo
          name="legajo_a_cargo"
          label="Legajo a cargo"
          persist={setOperativo}
          className="w-full basis-5/12"
        />
        <Input.Legajo
          name="legajo_planilla"
          label="Legajo planilla"
          persist={setOperativo}
          className="w-full basis-5/12"
        />
        <Select
          name="turno"
          label="Turno"
          persist={setOperativo}
          className="w-full basis-5/12"
          options={turnos}
          rules={{ required: 'Este campo es requerido' }}
        />
        <Select
          persist={setOperativo}
          name="seguridad"
          label="Seguridad"
          className="w-full basis-5/12"
          options={seguridad}
          rules={{ required: 'Este campo es requerido' }}
        />
        <Input
          name="qth"
          persist={setOperativo}
          label="Direccion"
          className="w-full basis-5/12"
          rules={{ required: 'Este campo es requerido' }}
          placeholder='Ej: "Av. Maipu 1234"'
        />
        <Autocomplete
          name="localidad"
          persist={setOperativo}
          label="Zona"
          inputId="idBarrio"
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
  editableRegistro,
  id,
}: {
  selects: {
    licencias: TipoLicencia[]
    motivos: Motivo[]
    resolucion: Record<'id' | 'label', keyof typeof resolucionSchema.enum>[]
    zonas: Barrio[]
    controlSustancias: { id: number; label: string }[]
  }
  editableRegistro?: z.infer<typeof registroInputSchema>
  id?: string
}) {
  const router = useRouter()
  const formProps = useForm<z.infer<typeof registroInputSchema>>({
    mode: 'all',
    resolver: zodResolver(registroInputSchema),
    defaultValues: {
      ...editableRegistro,
    },
  })
  const { setActiveStep, activeStep } = useStepForm()

  const handleBack = () => {
    setActiveStep(0)
  }

  const esSancionable =
    formProps.watch('resolucion') === resolucionSchema.enum.ACTA ||
    formProps.watch('resolucion') === resolucionSchema.enum.REMITIDO

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

  useEffect(() => {
    if (activeStep === 1) {
      const parsedOperativo = operativoInputSchema.safeParse(operativo)

      if (!parsedOperativo.success) {
        setActiveStep(0)
      }
    }
  }, [activeStep])

  const handleSubmit = async (body: z.infer<typeof registroInputSchema>) => {
    try {
      if (!id) {
        await setter<void>({
          route: `/operativos/autos`,
          body: {
            ...body,
            ...operativoInputSchema.safeParse(operativo).data,
          },
        })
        toast({ title: 'Operativo creado con exito', variant: 'success' })

        formProps.reset()

        formProps.setFocus('dominio')
      } else {
        await updater<void>({
          route: `/operativos/autos/${id}`,
          body: {
            ...body,
            ...operativoInputSchema.safeParse(operativo).data,
          },
        })
        toast({ title: 'Operativo actualizado con exito', variant: 'success' })
        router.back()
      }
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
          inputId="idTipo"
          inputLabel="tipo"
          className="w-full basis-5/12"
        />
        <Autocomplete
          name="zona_infractor"
          label="Zona infractor"
          options={zonas}
          inputId="idBarrio"
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
          name="control_sustancias"
          label="Control sustancias"
          className="w-full basis-5/12"
          options={selects.controlSustancias}
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
              inputId="idMotivo"
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
          <Button onClick={handleBack}>Atras</Button>

          <Button disabled={!formProps.formState.isValid} type="submit">
            Guardar
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
