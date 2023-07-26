'use client'
import React, { useEffect } from 'react'
import Button from '@/components/Button'
import Loader from '@/components/Loader'
import Modal from '@/components/Modal'
import Stepper from '@/components/Stepper'
import { LogoOVT, LogoVL } from '@/components/Logos'
import { useStepForm, useToast } from '@/hooks'
import { getSelects, setter } from '@/services'
import { FormInputProps } from '@/types'
import { setExpiration } from '@/utils/misc'
import { useRouter, useSelectedLayoutSegment } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import useSWR, { mutate } from 'swr'
import { useLocalStorage } from 'usehooks-ts'

function layout({ children }: { children: React.ReactNode }) {
  const { data } = useSession()
  const layoutSegment = useSelectedLayoutSegment() || ''
  const router = useRouter()
  const [operativo, setOperativo] = useLocalStorage(layoutSegment, {
    expiresAt: setExpiration(),
  })
  const { activeStep, setActiveStep } = useStepForm()
  const { isLoading } = useSWR('/api/selects', getSelects)
  const { toast } = useToast()
  const methods = useForm<FormInputProps>({
    mode: 'all',
    resetOptions: { keepDefaultValues: true },
    defaultValues: {
      lpcarga: data?.user?.legajo,
    },
  })

  const {
    handleSubmit,
    reset,
    formState: { isValid },
  } = methods

  const onSubmit = async (body: FormInputProps) => {
    try {
      const registro = await setter({
        route: `/operativos/${layoutSegment}`,
        body,
      })
      await mutate(layoutSegment, registro, {
        populateCache: (result, currentData) => [result, ...currentData],
        revalidate: false,
      })
      toast({ title: 'Operativo creado con exito', variant: 'success' })
      const { expiresAt, ...rest } = operativo
      reset(rest)
    } catch (error: any) {
      toast({ title: error.response.data, variant: 'default' })
    }
  }

  const nuevoOperativo = () => {
    setOperativo((state: any) => {
      Object.keys(state).forEach((key) => (state[key] = ''))
      state.expiresAt = setExpiration()
      return state
    })
    const { expiresAt, ...rest } = operativo
    reset(rest)
    setActiveStep(0)
  }

  useEffect(() => {
    if (
      operativo.expiresAt < Date.now() ||
      !Object.values(operativo).every(Boolean) ||
      Object.values(operativo).length === 1
    ) {
      nuevoOperativo()
    } else {
      const { expiresAt, ...rest } = operativo
      reset(rest)
      setActiveStep(1)
    }
  }, [])

  const isFirstStep = activeStep === 0
  const isLastStep = activeStep === 1

  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1)
  const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1)

  return (
    <Modal>
      <div className="flex flex-col justify-center items-center">
        <div className="flex justify-between w-full">
          <LogoVL />
          <Button onClick={nuevoOperativo} variant="text">
            Nuevo Operativo
          </Button>
          <Button onClick={router.back} variant="text">
            Salir
          </Button>
          <LogoOVT />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormProvider {...methods}>
            <Stepper steps={['Operativo', 'Vehiculo']} />
            {isLoading ? <Loader /> : children}
          </FormProvider>
          <div className="flex justify-between w-full">
            <Button disabled={isFirstStep} onClick={handlePrev}>
              Atras
            </Button>
            {!isLastStep ? (
              <Button disabled={isLastStep} onClick={handleNext}>
                Siguiente
              </Button>
            ) : (
              <Button disabled={!isValid} type="submit">
                Guardar
              </Button>
            )}
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default layout
