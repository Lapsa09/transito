'use client'

import { Button } from '@/components/ui'
import { useStepForm } from '@/hooks'
import React, { useEffect } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import Stepper from '@/components/Stepper'
import { DEFAULT_OPERATIVO_MOTO } from '@/schemas/motos'

function FormHeader() {
  const { setActiveStep } = useStepForm()
  const [operativo, setOperativo] = useLocalStorage<
    typeof DEFAULT_OPERATIVO_MOTO
  >('motos', DEFAULT_OPERATIVO_MOTO)
  const nuevoOperativo = () => {
    setOperativo(DEFAULT_OPERATIVO_MOTO)
    setActiveStep(0)
  }

  useEffect(() => {
    const { expiresAt, ...rest } = operativo
    if (expiresAt < Date.now() || !Object.values(rest).every(Boolean)) {
      nuevoOperativo()
    } else {
      setActiveStep(1)
    }
  }, [])
  return (
    <header className="w-full flex flex-col">
      <Button onClick={nuevoOperativo} variant="ghost">
        Nuevo Operativo
      </Button>
      <Stepper steps={['Operativo', 'Vehiculo']} />
    </header>
  )
}

export default FormHeader
