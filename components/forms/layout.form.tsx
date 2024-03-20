'use client'
import React, { FormEvent, PropsWithChildren, useEffect } from 'react'
import Button from '@/components/Button'
import Stepper from '@/components/Stepper'
import Loader from '@/components/Loader'
import { useStepForm, useToast } from '@/hooks'
import { getter, setter, updater } from '@/services'
import {
  EditInputProps,
  FormInputProps,
  LocalOperativo,
  RioFormProps,
  Roles,
  User,
} from '@/types'
import {
  useRouter,
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
} from 'next/navigation'
import {
  DefaultValues,
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form'
import useSWR, { mutate } from 'swr'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { useLocalStorage } from 'usehooks-ts'
import { Registro } from '@/types/camiones'
import { m } from 'framer-motion'

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
  const user = data?.user as User | undefined
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
  const layoutSegment = useSelectedLayoutSegment()
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
      const post = await setter<Registro>({
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
  const user = data?.user as User | undefined
  const router = useRouter()
  const [layoutSegment, id] = useSelectedLayoutSegments()
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1)
  const handleNext = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    !isLastStep && setActiveStep((cur) => cur + 1)
  }
  const { isLoading } = useSWR(
    user?.role === Roles.ADMIN
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
      const registro = await updater<Registro>({
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
        <div className="flex justify-between w-full">
          <Button onClick={nuevoOperativo} variant="text">
            Nuevo Operativo
          </Button>
          <Button onClick={router.back} variant="text">
            Salir
          </Button>
        </div>
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
}: PropsWithChildren<{
  onSubmit: SubmitHandler<T>
  className?: string
  data?: K[]
  id?: string
  defaultValues?: DefaultValues<T>
}>) => {
  const methods = useForm<T>({
    mode: 'all',
    defaultValues,
  })
  const { handleSubmit } = methods
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
          await handleSubmit(onSubmit)(e)
        }}
        id={id}
      >
        {children}
      </form>
    </FormProvider>
  )
}
