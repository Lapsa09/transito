import { Step, StepButton, Stepper } from '@mui/material'
import React from 'react'
import { sxStyles } from '../../utils'

function CustomStepper({ steps, isCompleted, handleStep, activeStep }) {
  return (
    <Stepper
      sx={[sxStyles.fullWidth, styles.stepper]}
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

const styles = {
  stepper: {
    my: '10px',
  },
}

export default CustomStepper
