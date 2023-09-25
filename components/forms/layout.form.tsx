'use client'
import React, { FormEvent, PropsWithChildren, useEffect } from 'react'
import Button from '@/components/Button'
import Stepper from '@/components/Stepper'
import Loader from '@/components/Loader'
import { useStepForm } from '@/hooks'
import { getSelects } from '@/services'
import { FormProps } from '@/types'
import { useRouter } from 'next/navigation'
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  UseFormReturn,
  useForm,
} from 'react-hook-form'
import useSWR from 'swr'
import { cn } from '@/lib/utils'

function layout({
  children,
  className,
  onSubmit,
  nuevoOperativo,
  methods,
  steps,
  stepTitles,
}: {
  children: React.ReactNode
  className?: string
  onSubmit: SubmitHandler<FormProps>
  nuevoOperativo?: () => void
  methods: UseFormReturn<any, any, undefined>
  steps: number
  stepTitles: string[]
}) {
  const { activeStep, setActiveStep } = useStepForm()
  const { isLoading } = useSWR('/api/selects', getSelects)
  const router = useRouter()
  const isFirstStep = activeStep === 0
  const isLastStep = activeStep === steps - 1

  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1)
  const handleNext = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    !isLastStep && setActiveStep((cur) => cur + 1)
  }

  const {
    handleSubmit,
    formState: { isValid },
  } = methods

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
          {isLoading ? <Loader /> : children}
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
}: PropsWithChildren<{
  onSubmit: SubmitHandler<T>
  className?: string
  data?: K[]
}>) => {
  const methods = useForm<T>({
    mode: 'all',
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
        onSubmit={handleSubmit(onSubmit)}
      >
        {children}
      </form>
    </FormProvider>
  )
}

export default layout
