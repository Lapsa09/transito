import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from '@mui/material'
import { currentDate, adminStyle, sxStyles } from '../utils'
import {
  CustomStepForm,
  CustomStepper,
  LogoOVT,
  LogoVL,
} from '../components/ui'
import { useLocalStorage, useSnackBar } from '../hooks'
import styles from '../styles/FormLayout.module.css'
import { FormProvider, Path, useFormContext } from 'react-hook-form'
import { SerializedError } from '@reduxjs/toolkit'

interface Props<T> {
  children: JSX.Element[]
  steps: Record<string, any>[]
  handleClose: () => void
  path: string
  error: SerializedError
  submitEvent: (data: T) => Promise<void>
}

type Operativo = {
  expiresAt: number
  [key: string]: any
}

function FormLayout<T>({
  children,
  steps,
  handleClose,
  path,
  error,
  submitEvent,
}: Props<T>) {
  const [open, setOpen] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [operativo, setOperativo] = useLocalStorage<Operativo>(path)
  const { handleError, handleSuccess } = useSnackBar()
  const methods = useFormContext<T>()

  const {
    setValue,
    reset,
    handleSubmit,
    formState: { isValid },
  } = methods

  const titles = ['Operativo', 'Vehiculo']

  const totalSteps = steps.length

  const isFirstStep = activeStep === 0

  const isLastStep = activeStep === totalSteps - 1

  const saveOp = () => {
    const expirationTime = operativo?.expiresAt
    setOperativo({
      ...steps[0],
      expiresAt: expirationTime || currentDate().plus({ hours: 8 }).toMillis(),
    })
  }

  const nuevoOperativo = () => {
    setOperativo(null)
    reset(null, { keepDefaultValues: true })
    setActiveStep(0)
  }

  const cargarOperativo = () => {
    try {
      if (currentDate().toMillis() < operativo.expiresAt) {
        Object.entries(operativo).forEach(([key, value]) => {
          setValue(key as Path<T>, value)
        })
        if (isCompleted(operativo)) setActiveStep(1)
      } else nuevoOperativo()
    } catch (error) {
      nuevoOperativo()
    }
  }

  const submiting = async (data: T) => {
    try {
      await submitEvent(data)
      handleSuccess('Cargado con exito')
    } catch (error) {
      handleError(error)
    }
  }

  useEffect(() => {
    if (error.code) {
      handleError(error)
    }
    cargarOperativo()
  }, [])

  const isCompleted = (values) => {
    try {
      const step = Object.values(values)
      return step.every((value) => Boolean(value))
    } catch (error) {
      return false
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleStep = (step) => {
    if (isCompleted(steps[activeStep])) saveOp()
    setTimeout(() => {
      setActiveStep(step)
    }, 250)
  }

  const handleNext = () => {
    handleStep(activeStep + 1)
  }

  const isStepCompleted = (step) => {
    return isCompleted(steps[step])
  }

  return (
    <Box sx={adminStyle} className={styles.form}>
      <div className={styles.header}>
        <LogoVL />
        <Button onClick={handleClose}>Cerrar</Button>
        <Button color="error" onClick={() => setOpen(true)} sx={style.button}>
          Nuevo Operativo
        </Button>
        <LogoOVT />
      </div>
      <div className={styles.form__form}>
        <CustomStepper
          isCompleted={isStepCompleted}
          handleStep={handleStep}
          activeStep={activeStep}
          stepsTitles={titles}
        />
        <Box
          onSubmit={handleSubmit(submiting)}
          component="form"
          className={styles.form__box}
          autoComplete="off"
        >
          <FormProvider {...methods}>
            <Box sx={sxStyles.flex}>
              {children?.map((child, index) => (
                <CustomStepForm
                  key={index}
                  activeStep={activeStep}
                  step={index}
                >
                  {child}
                </CustomStepForm>
              ))}
            </Box>
          </FormProvider>
          <Box sx={[sxStyles.flexRow, style.actions]}>
            <Button
              disabled={isFirstStep}
              onClick={handleBack}
              sx={style.button}
            >
              Anterior
            </Button>
            <Box sx={style.splitter} />
            {activeStep === 0 ? (
              <Button
                onClick={handleNext}
                disabled={isLastStep}
                sx={style.button}
              >
                Siguiente
              </Button>
            ) : (
              <Button type="submit" disabled={!isValid}>
                Guardar
              </Button>
            )}
          </Box>
        </Box>
      </div>

      <WarningModal
        open={open}
        reset={nuevoOperativo}
        close={() => setOpen(false)}
      />
    </Box>
  )
}

const WarningModal = ({ close, reset, open }) => {
  const handleReset = () => {
    reset()
    close()
  }
  return (
    <Dialog fullWidth maxWidth="md" onClose={close} open={open}>
      <DialogContent sx={adminStyle}>
        <p>
          Seguro que desea reiniciar el formulario? Se borraran todos los datos
          ingresados
        </p>
        <DialogActions sx={sxStyles.flex}>
          <Button onClick={close}>No</Button>
          <Box sx={style.dialogSplitter} />
          <Button onClick={handleReset}>Si</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}

const style = {
  button: { mr: 1 },
  actions: { pt: 2 },
  splitter: { flex: '0.45 1 auto' },
  dialogSplitter: { flex: '1 1 auto' },
}

export default FormLayout
