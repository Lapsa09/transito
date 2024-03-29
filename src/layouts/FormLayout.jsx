import React, { useEffect, useState } from 'react'
import { Box, Button, Modal } from '@mui/material'
import { useSelector } from 'react-redux'
import LogoVL from '../assets/imgs/LOGO_V_LOPEZ.png'
import LogoOVT from '../assets/imgs/OVT_LETRAS_NEGRAS.png'
import {
  currentDate,
  adminStyle,
  inspectorStyle,
  basicMaxHeight,
} from '../utils'
import { CustomSnackbar, CustomStepForm, CustomStepper } from '../components/ui'
import { DateTime } from 'luxon'
import { useLocalStorage, useSnackBar } from '../hooks'
import styles from '../styles/FormLayout.module.css'

function FormLayout({
  children,
  steps,
  activeStep,
  setActiveStep,
  handleClose,
  isValid,
  handleSubmit,
  path,
  error,
  submitEvent,
  reset,
  setValue,
}) {
  const user = useSelector((x) => x.user.user)
  const handleRol = () => user?.rol === 'ADMIN'
  const [open, setOpen] = useState(false)
  const [operative, setOperative] = useLocalStorage(path)
  const { openSB, closeSnackbar, response, setError, setSuccess } =
    useSnackBar()

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
    setActiveStep(activeStep + 1)
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
      setError(error)
    }
    cargarOperativo()
  }, [])

  const cargarOperativo = () => {
    try {
      if (currentDate().toMillis() < operative.expiresAt) {
        Object.entries(operative).forEach(([key, value]) => {
          key === 'fecha' || key === 'hora'
            ? setValue(key, DateTime.fromISO(value))
            : setValue(key, value)
        })
        isCompleted(operative) && setActiveStep(1)
      } else nuevoOperativo()
    } catch (error) {}
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
    reset({ lpcarga: user?.legajo }, { keepDefaultValues: true })
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
    <Box sx={handleRol() ? adminStyle : inspectorStyle} className={styles.form}>
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
        <Box component="form" className={styles.form__box} autoComplete="off">
          {children?.map((child, index) => (
            <CustomStepForm key={index} activeStep={activeStep} step={index}>
              {child}
            </CustomStepForm>
          ))}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button disabled={isFirstStep()} onClick={handleBack} sx={{ mr: 1 }}>
            Anterior
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {activeStep === 0 ? (
            <Button onClick={handleNext} disabled={isLastStep()} sx={{ mr: 1 }}>
              Siguiente
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!isValid || activeStep === 0}
              onClick={handleSubmit(submiting)}
            >
              Guardar
            </Button>
          )}
        </Box>
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <WarningModal reset={nuevoOperativo} setOpen={setOpen} />
      </Modal>
      <CustomSnackbar
        res={response}
        open={openSB}
        handleClose={closeSnackbar}
      />
    </Box>
  )
}

const WarningModal = ({ setOpen, reset }) => {
  return (
    <Box sx={adminStyle}>
      <p>
        Seguro que desea reiniciar el operativo? Se borraran todos los datos
        ingresados
      </p>
      <Box sx={{ display: 'flex' }}>
        <Button onClick={() => setOpen(false)}>No</Button>
        <Box sx={{ flex: '1 1 auto' }} />
        <Button
          onClick={() => {
            reset()
            setOpen(false)
          }}
        >
          Si
        </Button>
      </Box>
    </Box>
  )
}

export default FormLayout
