'use client'
import React, { useEffect } from 'react'
import Input from '@/components/Input'
import DatePicker from '@/components/DatePicker'
import TimePicker from '@/components/TimePicker'
import Autocomplete from '@/components/Autocomplete'
import Select from '@/components/Select'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { IoMdAdd, IoMdRemove } from 'react-icons/io'
import { useLocalStorage } from 'usehooks-ts'
import { setExpiration } from '@/utils/misc'
import {
  Barrio,
  Motivo,
  resolucionSchema,
  seguridadSchema,
  TipoLicencia,
  turnosSchema,
  VicenteLopez,
} from '@/drizzle/schema/schema'
import { DEFAULT_OPERATIVO_MOTO } from '@/schemas/motos'
import { zodResolver } from '@hookform/resolvers/zod'
import { operativoInputSchema, registroInputSchema } from '@/schemas/motos'
import { z } from 'zod'
import { toast, useStepForm } from '@/hooks'
import { useSession } from 'next-auth/react'
import { setter } from '@/services'
import { Button } from '../ui'

type FormProps = z.infer<typeof operativoInputSchema>

export function FirstStep({
  selects,
}: {
  selects: {
    vicenteLopez: VicenteLopez[]
    turnos: { id: keyof typeof turnosSchema.enum; label: string }[]
    seguridad: { id: keyof typeof seguridadSchema.enum; label: string }[]
  }
}) {
  const [operativo, edit] = useLocalStorage<typeof DEFAULT_OPERATIVO_MOTO>(
    'motos',
    DEFAULT_OPERATIVO_MOTO,
  )
  const formProps = useForm<FormProps>({
    resolver: zodResolver(operativoInputSchema),
    defaultValues: operativo,
    mode: 'onBlur',
  })

  const setOperativo = (value: any) => {
    edit((state) => ({
      ...state,
      ...value,
      expiresAt: state.expiresAt || setExpiration(),
    }))
  }

  const { setActiveStep } = useStepForm()

  const handleSubmit = (body: FormProps) => {
    setOperativo(body)
    setActiveStep(1)
  }

  const { vicenteLopez, turnos, seguridad } = selects
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
          inputId="idBarrio"
          inputLabel="barrio"
          className="w-full basis-5/12"
          rules={{ required: 'Este campo es requerido' }}
          options={vicenteLopez}
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
}: {
  selects: {
    licencias: TipoLicencia[]
    motivos: Motivo[]
    resolucion: { id: keyof typeof resolucionSchema.enum; label: string }[]
    zonas: Barrio[]
  }
}) {
  const { data } = useSession()
  const formProps = useForm<z.infer<typeof registroInputSchema>>({
    defaultValues: {
      lpcarga: data?.user?.legajo,
    },
  })
  const { fields, append, remove } = useFieldArray<
    z.infer<typeof registroInputSchema>
  >({ name: 'motivos' })

  const { setActiveStep } = useStepForm()

  const handleBack = () => {
    setActiveStep(0)
  }

  const esSancionable =
    formProps.watch('resolucion') === resolucionSchema.enum.ACTA ||
    formProps.watch('resolucion') === resolucionSchema.enum.REMITIDO

  const sumarMotivos = () => {
    if (fields.length < 5) {
      append(null)
    }
  }

  const restarMotivos = () => {
    if (fields.length > 1) {
      remove(-1)
    }
  }

  useEffect(() => {
    const parsedOperativo = operativoInputSchema.safeParse(operativo)

    if (!parsedOperativo.success) {
      setActiveStep(0)
    }
  }, [])

  const { licencias, motivos, resolucion, zonas } = selects

  const [operativo] = useLocalStorage<typeof DEFAULT_OPERATIVO_MOTO>(
    'motos',
    DEFAULT_OPERATIVO_MOTO,
  )

  useEffect(() => {
    if (!esSancionable) {
      formProps.resetField('motivos')
      formProps.resetField('acta')
    } else if (fields.length === 0) sumarMotivos()
  }, [esSancionable])

  const handleSubmit = async (body: z.infer<typeof registroInputSchema>) => {
    try {
      await setter<void>({
        route: `/operativos/motos`,
        body: {
          ...body,
          ...operativoInputSchema.safeParse(operativo).data,
        },
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
        {esSancionable && (
          <div className="flex justify-center items-center basis-full gap-2">
            <IoMdRemove
              className="cursor-pointer text-3xl"
              onClick={restarMotivos}
            />
            <h4>Motivos: {fields.length}</h4>
            <IoMdAdd
              className="cursor-pointer text-3xl"
              onClick={sumarMotivos}
            />
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
                inputId="idMotivo"
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
