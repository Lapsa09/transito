import { Step, StepButton, Stepper } from '@mui/material'
import React from 'react'
import { sxStyles } from '../../utils'

function CustomStepper({ isCompleted, handleStep, activeStep, stepsTitles }) {
  return (
    <Stepper
      sx={[sxStyles.fullWidth, styles.stepper]}
      nonLinear
      activeStep={activeStep}
    >
      {stepsTitles.map((title, index) => (
        <Step key={title} completed={isCompleted(index)}>
          <StepButton color="inherit" onClick={() => handleStep(index)}>
            {title}
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
