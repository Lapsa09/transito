import React from 'react'
import { Navigate } from 'react-router-dom'
import { Box, Button, FormHelperText } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { AppDispatch, IRootState, authActions, IRootUser } from '../redux'
import { CustomTextField, MainLogoOVT } from '../components'
import { history, sxStyles } from '../utils'
import { LoginUserProps } from '../types'
import '../styles/login.css'

function Login() {
  const { control, handleSubmit } = useForm<LoginUserProps>()
  const dispatch = useDispatch<AppDispatch>()
  const { user, error } = useSelector<IRootState, IRootUser>((x) => x.user)

  const submitEvent = (data: LoginUserProps) => {
    dispatch(authActions.login(data))
  }

  const register = () => {
    history.navigate('/register')
  }
  if (user.legajo) return <Navigate to="/" replace />

  return (
    <div className="login">
      <MainLogoOVT />
      <Box
        component="form"
        sx={sxStyles.basicWidth}
        className="form"
        onSubmit={handleSubmit(submitEvent)}
      >
        <CustomTextField.LEGAJO
          control={control}
          name="legajo"
          label="Legajo"
        />
        <CustomTextField.PASSWORD
          control={control}
          name="password"
          label="Contraseña"
        />
        {error?.name && <FormHelperText error>{error.message}</FormHelperText>}
        <Box className="buttons" sx={sxStyles.basicWidth}>
          <Button type="submit" variant="contained">
            Iniciar sesion
          </Button>
          <Button onClick={register}>No te registraste? Registrarse</Button>
        </Box>
      </Box>
    </div>
  )
}

export default Login
