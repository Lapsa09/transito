'use client'
import React, { FormEvent } from 'react'
import Button from '@/components/Button'
import Stepper from '@/components/Stepper'
import Loader from '@/components/Loader'
import { useStepForm } from '@/hooks'
import { getSelects } from '@/services'
import { FormInputProps, EditInputProps } from '@/types'
import { useRouter } from 'next/navigation'
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  UseFormReturn,
} from 'react-hook-form'
import useSWR from 'swr'

function layout({
  children,
  className,
  onSubmit,
  nuevoOperativo,
  methods,
}: {
  children: React.ReactNode
  className?: string
  onSubmit: SubmitHandler<FormInputProps & EditInputProps>
  nuevoOperativo: () => void
  methods: UseFormReturn<any, any, undefined>
}) {
  const { activeStep, setActiveStep } = useStepForm()
  const { isLoading } = useSWR('/api/selects', getSelects)
  const router = useRouter()
  const isFirstStep = activeStep === 0
  const isLastStep = activeStep === 1

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
      <div className="flex justify-between w-full">
        <Button onClick={nuevoOperativo} variant="text">
          Nuevo Operativo
        </Button>
        <Button onClick={router.back} variant="text">
          Salir
        </Button>
      </div>
      <form
        className="overflow-x-hidden"
        noValidate
        onSubmit={!isLastStep ? handleNext : handleSubmit(onSubmit)}
      >
        <FormProvider {...methods}>
          <Stepper steps={['Operativo', 'Vehiculo']} />
          {isLoading ? <Loader /> : children}
        </FormProvider>
        <div className="flex justify-between w-full">
          <Button disabled={isFirstStep} onClick={handlePrev}>
            Atras
          </Button>

          <Button disabled={!isValid && isLastStep} type="submit">
            {isLastStep ? 'Guardar' : 'Siguiente'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default layout
