'use client'
import React, { useEffect } from 'react'
import Button from '@/components/Button'
import Stepper from '@/components/Stepper'
import { FormProvider, useForm } from 'react-hook-form'
import { useStepForm } from '@/hooks'
import { getSelects, getter, updater } from '@/services'
import useSWR, { mutate } from 'swr'
import {
  usePathname,
  useSelectedLayoutSegment,
  useRouter,
} from 'next/navigation'
import { useToast } from '@/hooks'
import { EditInputProps } from '@/types'

function layout({ children }: React.PropsWithChildren) {
  const router = useRouter()
  const [, , , , id] = usePathname().split('/')
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

  const isFirstStep = activeStep === 0
  const isLastStep = activeStep === 1

  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1)
  const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1)

  const onSubmit = async (body: EditInputProps) => {
    if (!isLastStep) handleNext()
    else {
      try {
        const registro = await updater({
          route: `/operativos/${layoutSegment}/${id}`,
          body,
        })
        await mutate<EditInputProps>(layoutSegment, registro, {
          populateCache: (result, currentData) =>
            currentData.map((item: any) =>
              item.id === result.id ? result : item
            ),
          revalidate: false,
        })
        toast({ title: 'Operativo creado con exito', variant: 'success' })
        router.back()
      } catch (error: any) {
        toast({ title: error.response.data, variant: 'destructive' })
      }
    }
  }

  useEffect(() => {
    const fetchOperativo = async () => {
      const operativo = await getter<EditInputProps>({
        route: `operativos/${layoutSegment}/${id}`,
      })
      reset(operativo)
    }
    fetchOperativo()
  }, [layoutSegment, id])

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
          <Button disabled={!isValid && isLastStep} type="submit">
            {isLastStep ? 'Guardar' : 'Siguiente'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default layout
