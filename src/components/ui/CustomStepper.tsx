import { Step, StepButton, Stepper } from '@mui/material'
import React from 'react'

function CustomStepper({ steps, isCompleted, handleStep, activeStep }) {
  return (
    <Stepper
      sx={{ width: '100%', my: '10px' }}
      nonLinear
      activeStep={activeStep}
    >
      {steps.map(({ label, values }, index) => (
        <Step key={label} completed={isCompleted(values)}>
          <StepButton color="inherit" onClick={handleStep(index)}>
            {label}
          </StepButton>
        </Step>
      ))}
    </Stepper>
  )
}

export default CustomStepper
