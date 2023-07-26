'use client'
import React, { useEffect } from 'react'
import Button from '@/components/Button'
import Stepper from '@/components/Stepper'
import { FormProvider, useForm } from 'react-hook-form'
import { useStepForm } from '@/hooks'
import { getSelects, getter } from '@/services'
import useSWR from 'swr'
import { useParams, useSelectedLayoutSegment, useRouter } from 'next/navigation'
import { useToast } from '@/hooks'
import { EditInputProps } from '@/types'

function layout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const param = useParams()
  const layoutSegment = useSelectedLayoutSegment()
  const methods = useForm<EditInputProps>({
    mode: 'all',
  })
  const { activeStep, setActiveStep } = useStepForm()
  const { isLoading } = useSWR('/api/selects', getSelects)
  const {
    handleSubmit,
    formState: { isValid },
    reset,
  } = methods
  const { toast } = useToast()

  const onSubmit = (data: EditInputProps) => {
    console.log({ data, layoutSegment })
    toast({ title: 'Operativo creado con exito', variant: 'success' })
    router.back()
  }

  const isFirstStep = activeStep === 0
  const isLastStep = activeStep === 1

  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1)
  const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1)

  useEffect(() => {
    const fetchOperativo = async () => {
      const operativo = await getter<EditInputProps>({
        route: `operativos/${layoutSegment}/${param.id}`,
      })
      reset(operativo)
    }
    fetchOperativo()
  }, [layoutSegment, param.id])

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex justify-between w-full">
        <Button variant="text">Nuevo Operativo</Button>
        <Button variant="text">Salir</Button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormProvider {...methods}>
          <Stepper steps={['Operativo', 'Vehiculo']} />
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
  )
}

export default layout
