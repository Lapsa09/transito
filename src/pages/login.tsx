import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Box, Button, FormHelperText } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { FormProvider, useForm } from 'react-hook-form'
import { AppDispatch, IRootState, authActions, IRootUser } from '../redux'
import { CustomTextField, MainLogoOVT } from '../components'
import { sxStyles } from '../utils'
import { LoginUserProps } from '../types'
import '../styles/login.css'

function Login() {
  const methods = useForm<LoginUserProps>()
  const { handleSubmit } = methods
  const dispatch = useDispatch<AppDispatch>()
  const { user, error } = useSelector<IRootState, IRootUser>((x) => x.user)
  const navigate = useNavigate()

  const submitEvent = (data: LoginUserProps) => {
    dispatch(authActions.login(data))
  }

  const register = () => {
    navigate('/register')
  }
  if (user.legajo) return <Navigate to="/" replace />

  return (
    <div className="login">
      <MainLogoOVT />
      <FormProvider {...methods}>
        <Box
          component="form"
          sx={sxStyles.basicWidth}
          className="form"
          onSubmit={handleSubmit(submitEvent)}
        >
          <CustomTextField.LEGAJO name="legajo" label="Legajo" />
          <CustomTextField.PASSWORD name="password" label="Contraseña" />
          {error?.name && (
            <FormHelperText error>{error.message}</FormHelperText>
          )}
          <Box className="buttons" sx={sxStyles.basicWidth}>
            <Button type="submit" variant="contained">
              Iniciar sesion
            </Button>
            <Button onClick={register}>No te registraste? Registrarse</Button>
          </Box>
        </Box>
      </FormProvider>
    </div>
  )
}

export default Login
