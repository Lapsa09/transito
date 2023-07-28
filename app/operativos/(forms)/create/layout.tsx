'use client'
import React, { useEffect } from 'react'
import Button from '@/components/Button'
import Stepper from '@/components/Stepper'
import Loader from '@/components/Loader'
import { useStepForm, useToast } from '@/hooks'
import { getSelects, setter } from '@/services'
import { FormInputProps } from '@/types'
import { useRouter, useSelectedLayoutSegment } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import useSWR, { mutate } from 'swr'
import { useSession } from 'next-auth/react'
import { useLocalStorage } from 'usehooks-ts'
import { setExpiration } from '@/utils/misc'

interface Operativo {
  expiresAt: number
  [key: string]: string | number
}

function layout({ children }: { children: React.ReactNode }) {
  const { data } = useSession()
  const layoutSegment = useSelectedLayoutSegment() || ''
  const { activeStep, setActiveStep } = useStepForm()
  const { isLoading } = useSWR('/api/selects', getSelects)
  const { toast } = useToast()
  const router = useRouter()
  const [operativo, setOperativo] = useLocalStorage<Operativo>(layoutSegment, {
    expiresAt: setExpiration(),
  })
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

  const isFirstStep = activeStep === 0
  const isLastStep = activeStep === 1

  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1)
  const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1)

  const onSubmit = async (body: FormInputProps) => {
    // console.log({ body, layoutSegment })
    if (!isLastStep) handleNext()
    else {
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
  }

  const nuevoOperativo = () => {
    setOperativo((state) => {
      Object.keys(state).forEach((key) => (state[key] = ''))
      state.expiresAt = setExpiration()
      return state
    })
    const { expiresAt, ...rest } = operativo
    reset(rest)
    setActiveStep(0)
  }

  useEffect(() => {
    if (operativo.expiresAt < Date.now()) {
      nuevoOperativo()
    } else if (Object.values(operativo).every(Boolean)) {
      const { expiresAt, ...rest } = operativo
      reset(rest)
      setActiveStep(1)
    }
  }, [])

  return (
    <div className="flex flex-col justify-center items-center px-6">
      <div className="flex justify-between w-full">
        <Button onClick={nuevoOperativo} variant="text">
          Nuevo Operativo
        </Button>
        <Button onClick={router.back} variant="text">
          Salir
        </Button>
      </div>
      <form className="overflow-hidden" onSubmit={handleSubmit(onSubmit)}>
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