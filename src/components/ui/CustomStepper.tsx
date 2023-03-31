import { Step, StepButton, Stepper } from '@mui/material'
import React from 'react'
import { sxStyles } from '../../utils'

function CustomStepper({ steps, isCompleted, handleStep, activeStep }) {
  return (
    <Stepper
      sx={[sxStyles.fullWidth, { my: '10px' }]}
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
