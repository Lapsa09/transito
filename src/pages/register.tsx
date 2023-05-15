import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Box, Button, FormHelperText } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, FormProvider } from 'react-hook-form'
import { CustomTextField, MainLogoOVT } from '../components'
import { sxStyles } from '../utils'
import { AppDispatch, IRootState, authActions, IRootUser } from '../redux'
import '../styles/register.css'
import { RegisterUserProps } from '../types'

function Register() {
  const methods = useForm<RegisterUserProps>()
  const dispatch = useDispatch<AppDispatch>()
  const { user, error } = useSelector<IRootState, IRootUser>((x) => x.user)
  const navigate = useNavigate()

  const { handleSubmit, setError } = methods

  const loginNav = () => {
    navigate('/login')
  }

  const submitEvent = async (data: RegisterUserProps) => {
    if (data.password !== data.confirmPassword)
      setError('confirmPassword', {
        type: 'validate',
        message: 'Las contraseñas no coinciden',
      })
    else {
      dispatch(authActions.register(data))
    }
  }

  if (user.legajo) return <Navigate to="/" replace />

  return (
    <FormProvider {...methods}>
      <div className="register">
        <MainLogoOVT />
        <Box
          sx={sxStyles.basicWidth}
          component="form"
          className="form"
          onSubmit={handleSubmit(submitEvent)}
        >
          <CustomTextField.LEGAJO name="legajo" label="Legajo" />
          <CustomTextField
            name="nombre"
            rules={{ required: 'Campo requerido' }}
            label="Nombre"
          />
          <CustomTextField
            name="apellido"
            rules={{ required: 'Campo requerido' }}
            label="Apellido"
          />
          <CustomTextField
            type="number"
            name="telefono"
            rules={{ required: 'Campo requerido' }}
            label="Telefono"
          />
          <CustomTextField.PASSWORD name="password" label="Contraseña" />
          <CustomTextField.PASSWORD
            name="confirmPassword"
            label="Confirmar contraseña"
          />
          {error?.code && (
            <FormHelperText error>{error.message}</FormHelperText>
          )}
          <Box sx={sxStyles.basicWidth} className="buttons">
            <Button onClick={loginNav}>
              Ya te registraste? ir a iniciar Sesion
            </Button>
            <Button type="submit" variant="contained">
              Registrarse
            </Button>
          </Box>
        </Box>
      </div>
    </FormProvider>
  )
}

Register.public = true

export default Register
