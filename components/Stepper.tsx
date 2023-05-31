'use client'
import { Stepper, Step, Typography } from '@material-tailwind/react'
import React from 'react'

function CustomStepper({
  steps,
  activeStep,
  setActiveStep,
}: {
  steps: string[]
  activeStep: number
  setActiveStep: React.Dispatch<React.SetStateAction<number>>
}) {
  return (
    <Stepper
      className="w-full py-4 px-8 cursor-pointer"
      activeStep={activeStep}
    >
      {steps.map((step, i) => (
        <Step key={i} onClick={() => setActiveStep(i)}>
          <Typography className="h-5 w-5 text-center">{i + 1}</Typography>

          <Typography
            variant="h6"
            className="absolute -bottom-7 w-max text-center"
            color={activeStep === i ? 'blue' : 'blue-gray'}
          >
            {step}
          </Typography>
        </Step>
      ))}
    </Stepper>
  )
}

export default CustomStepper
