'use client'
import React, { useEffect } from 'react'
import Input from '@/components/Input'
import DatePicker from '@/components/DatePicker'
import TimePicker from '@/components/TimePicker'
import Autocomplete from '@/components/Autocomplete'
import Switch from '@/components/Switch'
import Select from '@/components/Select'
import { FormProvider, useForm } from 'react-hook-form'
import { useLocalStorage } from 'usehooks-ts'
import { setExpiration } from '@/utils/misc'
import {
  Barrio,
  Motivo,
  resolucionSchema,
  turnosSchema,
  VicenteLopez,
} from '@/drizzle/schema/schema'
import { DEFAULT_OPERATIVO_CAMION } from '@/schemas/camiones'
import { zodResolver } from '@hookform/resolvers/zod'
import { operativoInputSchema, registroInputSchema } from '@/schemas/camiones'
import { z } from 'zod'
import { toast, useStepForm } from '@/hooks'
import { setter, updater } from '@/services'
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
  }
  editableOperativo?: FormProps
}) {
  const [operativo, edit] = useLocalStorage<typeof DEFAULT_OPERATIVO_CAMION>(
    'camiones',
    DEFAULT_OPERATIVO_CAMION,
  )

  const setOperativo = (value: any) => {
    edit((state) => ({
      ...state,
      ...value,
      expiresAt: state.expiresAt || setExpiration(),
    }))
  }

  const formProps = useForm<FormProps>({
    resolver: zodResolver(operativoInputSchema),
    defaultValues: { ...operativo, ...editableOperativo },
    mode: 'onBlur',
  })
  const { setActiveStep } = useStepForm()

  const handleSubmit = (body: FormProps) => {
    setOperativo(body)
    setActiveStep(1)
  }

  const { vicenteLopez, turnos } = selects
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
          inputId="idBarrio"
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
    resolver: zodResolver(registroInputSchema),
    mode: 'onBlur',
    defaultValues: {
      ...editableRegistro,
    },
  })

  const esSancionable =
    formProps.watch('resolucion') === resolucionSchema.enum.ACTA ||
    formProps.watch('resolucion') === resolucionSchema.enum.REMITIDO

  const { motivos, resolucion, zonas } = selects

  const [operativo] = useLocalStorage<typeof DEFAULT_OPERATIVO_CAMION>(
    'camiones',
    DEFAULT_OPERATIVO_CAMION,
  )

  useEffect(() => {
    if (!esSancionable) {
      formProps.resetField('motivo')
      formProps.resetField('acta')
    }
  }, [esSancionable])

  const { setActiveStep } = useStepForm()

  const handleBack = () => {
    setActiveStep(0)
  }

  useEffect(() => {
    const parsedOperativo = operativoInputSchema.safeParse(operativo)

    if (!parsedOperativo.success) {
      setActiveStep(0)
    }
  }, [])

  const handleSubmit = async (body: z.infer<typeof registroInputSchema>) => {
    try {
      if (!id) {
        await setter<void>({
          route: `/operativos/camiones`,
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
          route: `/operativos/camiones/${id}`,
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
          inputId="idBarrio"
          inputLabel="barrio"
          className="w-full basis-5/12"
          rules={{ required: 'Este campo es requerido' }}
        />
        <Input label="Destino" name="destino" className="w-full basis-5/12" />
        <Autocomplete
          name="localidad_destino"
          label="Localidad de destino"
          options={zonas}
          inputId="idBarrio"
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
              inputId="idMotivo"
              inputLabel="motivo"
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
