import { create } from 'zustand'

type StepFormState = {
  activeStep: number
  setActiveStep: (activeStep: number | ((activeStep: number) => number)) => void
}

export const useStepForm = create<StepFormState>((set) => ({
  activeStep: 0,
  setActiveStep: (activeStep) =>
    set((state) => ({
      activeStep:
        typeof activeStep === 'function'
          ? activeStep(state.activeStep)
          : activeStep,
    })),
}))
