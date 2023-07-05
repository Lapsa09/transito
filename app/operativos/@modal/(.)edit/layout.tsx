'use client'
import React from 'react'
import Button from '@/components/Button'
import { LogoOVT, LogoVL } from '@/components/Logos'
import Modal from '@/components/Modal'
import Stepper from '@/components/Stepper'
import { FormProvider, useForm } from 'react-hook-form'
import { useStepForm } from '@/hooks'
import {
  getSelects,
  getSingleAuto,
  getSingleCamion,
  getSingleMoto,
} from '@/services'
import useSWR from 'swr'
import { useParams, useSelectedLayoutSegment, useRouter } from 'next/navigation'
import { useToast } from '@/hooks'
import { EditInputProps } from '@/types'

const chooseOperativo = {
  autos: getSingleAuto,
  motos: getSingleMoto,
  camiones: getSingleCamion,
}

type operativo = keyof typeof chooseOperativo

function AutosEditLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const param = useParams()
  const methods = useForm<EditInputProps>({
    mode: 'all',
    defaultValues: async () =>
      await chooseOperativo[layoutSegment as operativo](+param.id),
  })

  const { activeStep, setActiveStep } = useStepForm()
  const { isLoading } = useSWR('/api/selects', getSelects)
  const {
    handleSubmit,
    formState: { isValid },
  } = methods
  const { toast } = useToast()

  const layoutSegment = useSelectedLayoutSegment()

  const onSubmit = (data: EditInputProps) => {
    console.log({ data, layoutSegment })
    toast({ title: 'Operativo actualizado con exito', variant: 'success' })
    router.back()
  }

  const isFirstStep = activeStep === 0
  const isLastStep = activeStep === 1

  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1)
  const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1)

  return (
    <Modal>
      <div className="flex flex-col justify-center items-center">
        <div className="flex justify-between w-full">
          <LogoVL />
          <Button variant="text">Nuevo Operativo</Button>
          <Button variant="text">Salir</Button>
          <LogoOVT />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormProvider {...methods}>
            <Stepper
              setActiveStep={setActiveStep}
              activeStep={activeStep}
              steps={['Operativo', 'Vehiculo']}
            />
            {isLoading ? 'Cargando...' : children}
          </FormProvider>
          <div className="flex justify-between w-full">
            <Button disabled={isFirstStep} onClick={handlePrev}>
              Atras
            </Button>
            {isLastStep ? (
              <Button disabled={!isValid} type="submit">
                Guardar
              </Button>
            ) : (
              <Button disabled={isLastStep} onClick={handleNext}>
                Siguiente
              </Button>
            )}
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default AutosEditLayout
