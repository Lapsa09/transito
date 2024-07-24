'use client'

import { useStepForm, useToast } from '@/hooks'
import { setter } from '@/services'
import { turnos } from '@prisma/client'
import React, { FormEvent, useEffect } from 'react'
import Stepper from '@/components/Stepper'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { Button } from '@/components/ui'
import { useLocalStorage } from 'usehooks-ts'

function LayoutClient({ children }: { children: React.ReactNode }) {
  const stepTitles = ['Operativo', 'Inspector']
  const form = useForm()
  const { toast } = useToast()
  const { activeStep, setActiveStep } = useStepForm()
  const isFirstStep = activeStep === 0
  const isLastStep = activeStep === stepTitles.length - 1

  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1)
  const handleNext = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    !isLastStep && setActiveStep((cur) => cur + 1)
  }

  const [parte, setParte] = useLocalStorage<{
    fecha?: string
    turno?: turnos
    qth?: string
    expiresAt: number
  }>('partes', {
    expiresAt: 0,
  })

  const onSubmit = async (body: FieldValues) => {
    try {
      await setter({ route: 'radio/partes', body })
      toast({ title: 'Parte creado con exito', variant: 'success' })
      const { expiresAt, ...rest } = parte
      form.reset(rest)
      form.setFocus('operario')
    } catch (error: any) {
      toast({
        title: error.response?.data || error.message,
        variant: 'destructive',
      })
    }
  }

  const nuevoParte = () => {
    setParte({
      expiresAt: 0,
    })
    form.reset()
    setActiveStep(0)
  }

  useEffect(() => {
    const { expiresAt, ...rest } = parte
    if (expiresAt < Date.now() || Object.entries(rest).length === 0) {
      nuevoParte()
    } else {
      form.reset(rest)
      setActiveStep(1)
    }
  }, [])

  return (
    <FormProvider {...form}>
      <Button onClick={nuevoParte} variant="link">
        Resetear
      </Button>
      <form
        className="overflow-x-hidden"
        noValidate
        onSubmit={!isLastStep ? handleNext : form.handleSubmit(onSubmit)}
      >
        <FormProvider {...form}>
          {stepTitles.length > 1 && <Stepper steps={stepTitles} />}
          {children}
        </FormProvider>
        <div className="flex justify-between w-full">
          <Button disabled={isFirstStep} onClick={handlePrev}>
            Atras
          </Button>

          <Button
            disabled={isLastStep && !form.formState.isValid}
            type="submit"
          >
            {isLastStep ? 'Guardar' : 'Siguiente'}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}

export default LayoutClient
