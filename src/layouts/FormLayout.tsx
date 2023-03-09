import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from '@mui/material'
import LogoVL from '../assets/imgs/LOGO_V_LOPEZ.png'
import LogoOVT from '../assets/imgs/OVT_LETRAS_NEGRAS.png'
import { currentDate, adminStyle, basicMaxHeight } from '../utils'
import { CustomSnackbar, CustomStepForm, CustomStepper } from '../components/ui'
import { DateTime } from 'luxon'
import { useLocalStorage, useSnackBar } from '../hooks'
import styles from '../styles/FormLayout.module.css'
import { useFormContext } from 'react-hook-form'
import { FormInputProps, Operativo } from '../types'
import { SerializedError } from '@reduxjs/toolkit'

interface FormLayoutProps {
  children: JSX.Element[]
  steps: { label: string; values: any }[]
  activeStep: number
  setActiveStep: React.Dispatch<React.SetStateAction<number>>
  handleClose: () => void
  path: string
  error: SerializedError
  submitEvent: (data: FormInputProps) => Promise<void>
}

interface Operative extends Operativo {
  expiresAt: number
}

function FormLayout({
  children,
  steps,
  activeStep,
  setActiveStep,
  handleClose,
  path,
  error,
  submitEvent,
}: FormLayoutProps) {
  const [open, setOpen] = useState(false)
  const [operative, setOperative] = useLocalStorage<Operative>(path)
  const { openSB, closeSnackbar, response, setError, setSuccess } =
    useSnackBar()
  const {
    setValue,
    reset,
    handleSubmit,
    formState: { isValid },
  } = useFormContext<FormInputProps>()

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
    const expirationTime = operative?.expiresAt
    setOperative({
      ...steps[0].values,
      expiresAt: expirationTime || currentDate().plus({ hours: 8 }).toMillis(),
    })
  }

  useEffect(() => {
    if (error) {
      setError(error.message)
    }
    cargarOperativo()
  }, [])

  const cargarOperativo = () => {
    try {
      if (currentDate().toMillis() < operative.expiresAt) {
        Object.entries(operative).forEach(([key, value]: [any, any]) => {
          key === 'fecha' || key === 'hora'
            ? setValue(key, DateTime.fromISO(value))
            : setValue(key, value)
        })
        isCompleted(operative) && setActiveStep(1)
      } else nuevoOperativo()
    } catch (error) {
      nuevoOperativo()
    }
  }

  const submiting = async (data) => {
    try {
      await submitEvent(data)
      setSuccess('Cargado con exito')
    } catch (error) {
      setError(error.response?.data)
    }
  }

  const nuevoOperativo = () => {
    setOperative(null)
    reset({}, { keepDefaultValues: true })
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
        <Box sx={{ ...basicMaxHeight, cursor: 'pointer' }}>
          <img src={LogoVL} alt="Logo Vicente Lopez" />
        </Box>
        <Button onClick={handleClose}>Cerrar</Button>
        <Button color="error" onClick={() => setOpen(true)} sx={{ mr: 1 }}>
          Nuevo Operativo
        </Button>
        <Box sx={{ ...basicMaxHeight, cursor: 'pointer' }}>
          <img src={LogoOVT} alt="Logo Observatorio Vial" />
        </Box>
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
          <Box sx={{ display: 'flex' }}>
            {children?.map((child, index) => (
              <CustomStepForm key={index} activeStep={activeStep} step={index}>
                {child}
              </CustomStepForm>
            ))}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
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
        <DialogActions sx={{ display: 'flex' }}>
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
