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
  CustomSnackbar,
  CustomStepForm,
  CustomStepper,
  LogoOVT,
  LogoVL,
} from '../components/ui'
import { DateTime } from 'luxon'
import { useLocalStorage, useSnackBar } from '../hooks'
import styles from '../styles/FormLayout.module.css'
import { Path, PathValue, useFormContext } from 'react-hook-form'
import { SerializedError } from '@reduxjs/toolkit'

interface Props<T> {
  children: JSX.Element[]
  steps: { label: string; values: any }[]
  activeStep: number
  setActiveStep: React.Dispatch<React.SetStateAction<number>>
  handleClose: () => void
  path: string
  error: SerializedError
  submitEvent: (data: T) => Promise<void>
}

type Operativo<T> = T & {
  expiresAt: number
}

function FormLayout<T>({
  children,
  steps,
  activeStep,
  setActiveStep,
  handleClose,
  path,
  error,
  submitEvent,
}: Props<T>) {
  const [open, setOpen] = useState(false)
  const [operativo, setOperativo] = useLocalStorage<Operativo<T>>(path)
  const { openSB, closeSnackbar, response, setError, setSuccess } =
    useSnackBar()
  const {
    setValue,
    reset,
    handleSubmit,
    formState: { isValid },
  } = useFormContext<T>()

  const totalSteps = () => {
    return steps.length
  }

  const isFirstStep = () => {
    return activeStep === 0
  }

  const isLastStep = () => {
    return activeStep === totalSteps() - 1
  }

  const handleNext = () => {
    if (isCompleted(steps[activeStep]?.values)) saveOp()
    setTimeout(() => {
      setActiveStep(activeStep + 1)
    }, 250)
  }

  const saveOp = () => {
    const expirationTime = operativo?.expiresAt
    setOperativo({
      ...steps[0].values,
      expiresAt: expirationTime || currentDate().plus({ hours: 8 }).toMillis(),
    })
  }

  useEffect(() => {
    if (error.code) {
      setError(error.message)
    }
    cargarOperativo()
  }, [])

  const cargarOperativo = () => {
    try {
      if (currentDate().toMillis() < operativo.expiresAt) {
        Object.entries(operativo).forEach(([key, value]: [Path<T>, any]) => {
          key === 'fecha' || key === 'hora'
            ? setValue(key, DateTime.fromISO(value) as PathValue<T, Path<T>>)
            : setValue(key, value)
        })
        isCompleted(operativo) && setActiveStep(1)
      } else nuevoOperativo()
    } catch (error) {
      nuevoOperativo()
    }
  }

  const submiting = async (data: T) => {
    try {
      await submitEvent(data)
      setSuccess('Cargado con exito')
    } catch (error) {
      setError(error.response?.data)
    }
  }

  const nuevoOperativo = () => {
    setOperativo(null)
    reset(null, { keepDefaultValues: true })
    setActiveStep(0)
  }

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

  const handleStep = (step) => () => {
    if (isCompleted(steps[activeStep]?.values)) saveOp()
    setActiveStep(step)
  }

  return (
    <Box sx={adminStyle} className={styles.form}>
      <div className={styles.header}>
        <LogoVL />
        <Button onClick={handleClose}>Cerrar</Button>
        <Button color="error" onClick={() => setOpen(true)} sx={{ mr: 1 }}>
          Nuevo Operativo
        </Button>
        <LogoOVT />
      </div>
      <div className={styles.form__form}>
        <CustomStepper
          steps={steps}
          isCompleted={isCompleted}
          handleStep={handleStep}
          activeStep={activeStep}
        />
        <Box
          onSubmit={handleSubmit(submiting)}
          component="form"
          className={styles.form__box}
          autoComplete="off"
        >
          <Box sx={sxStyles.flex}>
            {children?.map((child, index) => (
              <CustomStepForm key={index} activeStep={activeStep} step={index}>
                {child}
              </CustomStepForm>
            ))}
          </Box>
          <Box sx={[sxStyles.flexRow, { pt: 2 }]}>
            <Button
              disabled={isFirstStep()}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Anterior
            </Button>
            <Box sx={{ flex: '0.45 1 auto' }} />
            {activeStep === 0 ? (
              <Button
                onClick={handleNext}
                disabled={isLastStep()}
                sx={{ mr: 1 }}
              >
                Siguiente
              </Button>
            ) : (
              <Button type="submit" disabled={!isValid || activeStep === 0}>
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

      <CustomSnackbar
        res={response}
        open={openSB}
        handleClose={closeSnackbar}
      />
    </Box>
  )
}

const WarningModal = ({ close, reset, open }) => {
  return (
    <Dialog fullWidth maxWidth="md" onClose={close} open={open}>
      <DialogContent sx={adminStyle}>
        <p>
          Seguro que desea reiniciar el operativo? Se borraran todos los datos
          ingresados
        </p>
        <DialogActions sx={sxStyles.flex}>
          <Button onClick={close}>No</Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button
            onClick={() => {
              reset()
              close()
            }}
          >
            Si
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}

export default FormLayout
