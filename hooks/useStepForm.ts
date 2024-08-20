'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export const useStepForm = () => {
  const searchParams = useSearchParams()
  const pathName = usePathname()
  const router = useRouter()

  const activeStep = parseInt(searchParams.get('step') ?? '0')

  const setActiveStep = (newStep: number | ((step: number) => number)) => {
    const newParams = new URLSearchParams(searchParams)
    if (typeof newStep === 'function') {
      newParams.set('step', newStep(activeStep).toString())
    } else {
      newParams.set('step', newStep.toString())
    }
    setTimeout(() => {
      router.replace(`${pathName}?${newParams.toString()}`)
    }, 200)
  }

  return {
    activeStep,
    setActiveStep,
  }
}
