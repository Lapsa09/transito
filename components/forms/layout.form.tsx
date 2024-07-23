'use client'
import Button from '@/components/Button'
import Loader from '@/components/Loader'
import Stepper from '@/components/Stepper'
import { useStepForm, useToast } from '@/hooks'
import { cn } from '@/lib/utils'
import { getter, setter, updater } from '@/services'
import {
  EditInputProps,
  Empleado,
  FormInputProps,
  LocalOperativo,
  RioFormProps,
} from '@/types'
import { Registro } from '@/types/camiones'
import { useSession } from 'next-auth/react'
import { useRouter, useSelectedLayoutSegments } from 'next/navigation'
import React, { FormEvent, PropsWithChildren, useEffect } from 'react'
import {
  DefaultValues,
  FieldValues,
  FormProvider,
  SubmitHandler,
  UseFormReturn,
  useForm,
} from 'react-hook-form'
import useSWR from 'swr'
import { useLocalStorage } from 'usehooks-ts'

export function CreateFormLayout({
  children,
  className,
  stepTitles,
  section,
}: PropsWithChildren<{
  className?: string
  stepTitles: string[]
  section: string
}>) {
  const { activeStep, setActiveStep } = useStepForm()
  const isFirstStep = activeStep === 0
  const isLastStep = activeStep === stepTitles.length - 1

  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1)
  const handleNext = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    !isLastStep && setActiveStep((cur) => cur + 1)
  }

  const { data } = useSession({ required: true })
  const user = data?.user as Empleado
  const methods = useForm<FormInputProps | RioFormProps>({
    mode: 'all',
    resetOptions: { keepDefaultValues: true },
    defaultValues: {
      lpcarga: user?.legajo,
    },
  })
  const {
    reset,
    setFocus,
    setValue,
    handleSubmit,
    formState: { isValid },
  } = methods
  const [layoutSegment] = useSelectedLayoutSegments()
  const { toast } = useToast()
  const [operativo, setOperativo] = useLocalStorage<LocalOperativo>(
    layoutSegment as string,
    {
      expiresAt: 0,
    },
  )

  const onSubmit: SubmitHandler<FormInputProps | RioFormProps> = async (
    body,
  ) => {
    try {
      await setter<Registro>({
        route: `/${section}/${layoutSegment}`,
        body,
      })
      toast({ title: 'Operativo creado con exito', variant: 'success' })
      const { expiresAt, ...rest } = operativo
      if (layoutSegment === 'camiones') {
        reset({ ...rest, hora: '' })
      } else if (layoutSegment === 'rio') {
        reset({ ...body, dominio: '' })
      } else {
        reset(rest)
      }
      setFocus('dominio', { shouldSelect: true })
    } catch (error: any) {
      toast({
        title: error.response?.data || error.message,
        variant: 'destructive',
      })
    }
  }

  const nuevoOperativo = () => {
    setOperativo({
      expiresAt: 0,
    })
    reset()
    setActiveStep(0)
  }

  useEffect(() => {
    if (user?.legajo) {
      setValue('lpcarga', user.legajo)
    }
  }, [data])

  useEffect(() => {
    const { expiresAt, ...rest } = operativo
    if (expiresAt < Date.now() || Object.entries(rest).length === 0) {
      nuevoOperativo()
    } else {
      reset(rest)
      setActiveStep(1)
    }
  }, [])

  return (
    <div className={className}>
      {nuevoOperativo && (
        <Button onClick={nuevoOperativo} variant="text">
          Nuevo Operativo
        </Button>
      )}
      <form
        className="overflow-x-hidden"
        noValidate
        onSubmit={!isLastStep ? handleNext : handleSubmit(onSubmit)}
      >
        <FormProvider {...methods}>
          {stepTitles.length > 1 && <Stepper steps={stepTitles} />}
          {children}
        </FormProvider>
        <div className="flex justify-between w-full">
          {stepTitles.length > 1 && (
            <Button disabled={isFirstStep} onClick={handlePrev}>
              Atras
            </Button>
          )}

          <Button disabled={isLastStep && !isValid} type="submit">
            {isLastStep ? 'Guardar' : 'Siguiente'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export function EditFormLayout({
  section,
  children,
  className,
  stepTitles,
}: {
  section: string
  children: React.ReactNode
  className?: string
  stepTitles: string[]
}) {
  const { activeStep, setActiveStep } = useStepForm()
  const isFirstStep = activeStep === 0
  const isLastStep = activeStep === stepTitles.length - 1
  const { data } = useSession({ required: true })
  const user = data?.user as Empleado | undefined
  const router = useRouter()
  const [layoutSegment, id] = useSelectedLayoutSegments()
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1)
  const handleNext = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    !isLastStep && setActiveStep((cur) => cur + 1)
  }
  const { isLoading } = useSWR(
    user?.metaData.isAdmin
      ? { route: `/${section}/${layoutSegment}/${id}` }
      : null,
    getter,
    {
      onSuccess: async (data) => {
        reset(data)
        setActiveStep(1)
      },
      onError: () => {
        router.replace(`/${section}/` + layoutSegment)
      },
    },
  )
  const [, setOperativo] = useLocalStorage<LocalOperativo>(layoutSegment, {
    expiresAt: 0,
  })
  const methods = useForm<EditInputProps | RioFormProps>({
    mode: 'all',
    defaultValues: {
      lpcarga: user?.legajo,
    },
  })
  const {
    reset,
    handleSubmit,
    formState: { isValid },
  } = methods
  const { toast } = useToast()

  const onSubmit: SubmitHandler<EditInputProps | RioFormProps> = async (
    body,
  ) => {
    try {
      await updater<Registro>({
        route: `/${section}/${layoutSegment}/${id}`,
        body,
      })
      toast({ title: 'Operativo editado con exito', variant: 'success' })
      router.back()
    } catch (error: any) {
      toast({
        title: error.response.data || error.message,
        variant: 'destructive',
      })
    }
  }

  const nuevoOperativo = () => {
    setOperativo({
      expiresAt: 0,
    })
    reset()
    setActiveStep(0)
  }

  if (isLoading) return <Loader />
  return (
    <div className={className}>
      {nuevoOperativo && (
        <Button onClick={nuevoOperativo} variant="text">
          Nuevo Operativo
        </Button>
      )}
      <form
        className="overflow-x-hidden"
        noValidate
        onSubmit={!isLastStep ? handleNext : handleSubmit(onSubmit)}
      >
        <FormProvider {...methods}>
          {stepTitles.length > 1 && <Stepper steps={stepTitles} />}
          {children}
        </FormProvider>
        <div className="flex justify-between w-full">
          {stepTitles.length > 1 && (
            <Button disabled={isFirstStep} onClick={handlePrev}>
              Atras
            </Button>
          )}

          <Button disabled={isLastStep && !isValid} type="submit">
            {isLastStep ? 'Guardar' : 'Siguiente'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export const RegularForm = <T extends FieldValues, K extends FieldValues>({
  onSubmit,
  children,
  className,
  data,
  id,
  defaultValues,
  resetOnSubmit = false,
}: {
  onSubmit: SubmitHandler<T>
  className?: string
  data?: K[]
  id?: string
  defaultValues?: DefaultValues<T>
  children: React.ReactNode | ((methods: UseFormReturn<T>) => React.ReactNode)
  resetOnSubmit?: boolean
}) => {
  const methods = useForm<T>({
    mode: 'all',
    defaultValues,
  })
  useEffect(() => {
    if (data) {
      data.forEach((item) => {
        const [key, value] = Object.values(item)

        methods.setValue(key, value)
      })
    }
  }, [data])

  return (
    <FormProvider {...methods}>
      <form
        className={cn('w-full', className)}
        onSubmit={async (e) => {
          e.stopPropagation()
          await methods.handleSubmit(onSubmit)(e)
          if (resetOnSubmit) methods.reset()
        }}
        id={id}
      >
        {typeof children === 'function' ? children(methods) : children}
      </form>
    </FormProvider>
  )
}
