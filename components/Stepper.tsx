'use client'
import { useStepForm } from '@/hooks'
import React from 'react'

function CustomStepper({ steps }: { steps: string[] }) {
  const { activeStep, setActiveStep } = useStepForm()
  return (
    <ul className="steps w-full">
      {steps.map((step, i) => (
        <li
          className={`step ${activeStep >= i ? 'step-accent' : 'step-neutral'}  cursor-pointer`}
          key={step}
          onClick={() => setActiveStep(i)}
        >
          {step}
        </li>
      ))}
    </ul>
  )
}

export default CustomStepper
