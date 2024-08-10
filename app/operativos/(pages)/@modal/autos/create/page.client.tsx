'use client'

import { Button } from '@/components/ui'
import { useStepForm } from '@/hooks'
import React, { PropsWithChildren, useEffect } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import Stepper from '@/components/Stepper'
import { DEFAULT_OPERATIVO_AUTO } from '@/utils/localOperativos'
import CustomModal from '@/components/Modal'

function PageClient({ children }: PropsWithChildren<{ className?: string }>) {
  const { setActiveStep } = useStepForm()
  const [operativo, setOperativo] = useLocalStorage<
    typeof DEFAULT_OPERATIVO_AUTO
  >('autos', DEFAULT_OPERATIVO_AUTO)
  const nuevoOperativo = () => {
    setOperativo(DEFAULT_OPERATIVO_AUTO)
    setActiveStep(0)
  }

  useEffect(() => {
    const { expiresAt, ...rest } = operativo
    if (expiresAt < Date.now() || Object.entries(rest).length === 0) {
      nuevoOperativo()
    }
  }, [])
  return (
    <CustomModal>
      <div className="flex flex-col justify-center items-center px-6">
        <Button onClick={nuevoOperativo} variant="ghost">
          Nuevo Operativo
        </Button>
        <Stepper steps={['Operativo', 'Vehiculo']} />
        {children}
      </div>
    </CustomModal>
  )
}

export default PageClient
