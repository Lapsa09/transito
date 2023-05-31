'use client'
import { Button, Stepper } from '@/components'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import useSWR from 'swr'
import { getSelects } from '@/services'

function layout({ children }: { children: React.ReactNode[] }) {
  const methods = useForm()
  const [activeStep, setActiveStep] = useState(0)
  const router = useRouter()
  const { isLoading } = useSWR('/api/selects', getSelects)

  const isFirstStep = activeStep === 0
  const isLastStep = activeStep === 1

  const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1)
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1)
  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-1/2">
        <Button>Nuevo Operativo</Button>
        <Button onClick={() => router.back()}>Salir</Button>
      </div>
      <FormProvider {...methods}>
        <Stepper
          setActiveStep={setActiveStep}
          activeStep={activeStep}
          steps={['Operativo', 'Vehiculo']}
        />
        {isLoading ? 'Cargando...' : children}
      </FormProvider>
      <div className="flex justify-between w-1/2">
        <Button disabled={isFirstStep} onClick={handlePrev}>
          Atras
        </Button>
        {isLastStep ? (
          <Button>Guardar</Button>
        ) : (
          <Button onClick={handleNext}>Siguiente</Button>
        )}
      </div>
    </div>
  )
}

export default layout
