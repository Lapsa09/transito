'use client'
import React from 'react'
import { Button, LogoOVT, LogoVL, Modal, Stepper } from '@/components'
import { FormProvider, useForm } from 'react-hook-form'
import { useStepForm } from '@/hooks'

function AutosFormLayout({ children }: { children: React.ReactNode }) {
  const methods = useForm()
  const { activeStep, setActiveStep } = useStepForm()

  const isFirstStep = activeStep === 0
  const isLastStep = activeStep === 1

  const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1)
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1)
  return (
    <Modal>
      <div className="flex flex-col justify-center items-center">
        <div className="flex justify-between w-full">
          <LogoVL />
          <Button variant="text">Nuevo Operativo</Button>
          <Button variant="text">Salir</Button>
          <LogoOVT />
        </div>
        <FormProvider {...methods}>
          <Stepper
            setActiveStep={setActiveStep}
            activeStep={activeStep}
            steps={['Operativo', 'Vehiculo']}
          />
          {children}
        </FormProvider>
        <div className="flex justify-between w-full">
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
    </Modal>
  )
}

export default AutosFormLayout
