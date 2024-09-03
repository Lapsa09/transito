'use client'
import AutoComplete from '@/components/Autocomplete'
import DateField from '@/components/DatePicker'
import Input from '@/components/Input'
import Select from '@/components/Select'
import TimeField from '@/components/TimePicker'
import { toast, useStepForm } from '@/hooks'
import {
  DEFAULT_OPERATIVO_RIO,
  operativoInputSchema,
  registroInputSchema,
} from '@/schemas/rio'
import { setter, updater } from '@/services'
import { setExpiration } from '@/utils/misc'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useLocalStorage } from 'usehooks-ts'
import { z } from 'zod'
import { Button } from '../ui'
import { turnosSchema } from '@/drizzle/schema/schema'
import { zonas } from '@/drizzle/schema/nuevo_control'
import { useRouter } from 'next/navigation'

type FormProps = z.infer<typeof operativoInputSchema>

export function FirstStep({
  selects,
  editableOperativo,
}: {
  selects: {
    turnos: Record<'id' | 'label', keyof typeof turnosSchema.enum>[]
  }
  editableOperativo?: FormProps
}) {
  const { turnos } = selects

  const [operativo, edit] = useLocalStorage<typeof DEFAULT_OPERATIVO_RIO>(
    'rio',
    DEFAULT_OPERATIVO_RIO,
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

  return (
    <FormProvider {...formProps}>
      <form
        onSubmit={formProps.handleSubmit(handleSubmit)}
        className="flex w-full justify-between flex-wrap"
      >
        <DateField
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
        <TimeField
          name="hora"
          label="Hora"
          className="w-full basis-5/12"
          persist={setOperativo}
        />
        <Input.Legajo
          name="lp"
          label="Legajo"
          className="w-full basis-5/12"
          rules={{ required: 'Este campo es requerido' }}
          persist={setOperativo}
        />
        <Select
          name="turno"
          label="Turno"
          className="w-full basis-5/12"
          options={turnos}
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
    zonasPaseo: (typeof zonas.$inferSelect)[]
  }
  editableRegistro?: z.infer<typeof registroInputSchema>
  id?: string
}) {
  const { zonasPaseo } = selects
  const router = useRouter()
  const formProps = useForm<z.infer<typeof registroInputSchema>>({
    mode: 'onBlur',
    resolver: zodResolver(registroInputSchema),
    defaultValues: {
      ...editableRegistro,
    },
  })
  const { setActiveStep } = useStepForm()

  const handleBack = () => {
    setActiveStep(0)
  }

  const [operativo] = useLocalStorage<typeof DEFAULT_OPERATIVO_RIO>(
    'rio',
    DEFAULT_OPERATIVO_RIO,
  )

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
          route: `/operativos/rio`,
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
          route: `/operativos/rio/${id}`,
          body,
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
          name="dominio"
          label="Dominio"
          className="w-full basis-5/12"
        />
        <AutoComplete
          name="zona"
          label="Zona"
          inputId="idZona"
          inputLabel="zona"
          className="w-full basis-5/12"
          options={zonasPaseo}
        />
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
