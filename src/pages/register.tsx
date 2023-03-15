import React from 'react'
import { Navigate } from 'react-router-dom'
import { Box, Button, FormHelperText } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, FormProvider } from 'react-hook-form'
import {
  ConfirmPasswordField,
  CustomTextField,
  MainLogoOVT,
  PasswordField,
} from '../components'
import { basicWidth, history } from '../utils'
import { AppDispatch, IRootState, authActions, IRootUser } from '../redux'
import '../styles/register.css'
import { RegisterUserProps } from '../types'

function Register() {
  const methods = useForm<RegisterUserProps>()
  const dispatch = useDispatch<AppDispatch>()
  const { user, error } = useSelector<IRootState, IRootUser>((x) => x.user)

  const { control, handleSubmit } = methods

  const loginNav = () => {
    history.navigate('/login')
  }

  const submitEvent = async (data: RegisterUserProps) => {
    dispatch(authActions.register(data))
  }

  if (user.legajo) return <Navigate to="/" replace />

  return (
    <FormProvider {...methods}>
      <div className="register">
        <MainLogoOVT />
        <Box
          sx={{ ...basicWidth }}
          component="form"
          className="form"
          onSubmit={handleSubmit(submitEvent)}
        >
          <CustomTextField
            type="number"
            control={control}
            rules={{ required: 'Campo requerido' }}
            name="legajo"
            label="Legajo"
          />
          <CustomTextField
            control={control}
            name="nombre"
            rules={{ required: 'Campo requerido' }}
            label="Nombre"
          />
          <CustomTextField
            control={control}
            name="apellido"
            rules={{ required: 'Campo requerido' }}
            label="Apellido"
          />
          <CustomTextField
            type="number"
            control={control}
            name="telefono"
            rules={{ required: 'Campo requerido' }}
            label="Telefono"
          />
          <PasswordField control={control} name="password" label="Contraseña" />
          <ConfirmPasswordField
            control={control}
            name="confirmPassword"
            label="Confirmar contraseña"
          />
          {error?.code && (
            <FormHelperText error>{error.message}</FormHelperText>
          )}
          <Box sx={{ ...basicWidth }} className="buttons">
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
