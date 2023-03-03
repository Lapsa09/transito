import React, { useEffect } from 'react'
import { Box, Button, FormHelperText } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { AppDispatch, IRootState, authActions } from '../redux'
import { CustomTextField } from '../components'
import { basicWidth, history } from '../utils'
import LogoOVT from '../assets/imgs/OVT_LETRAS_NEGRAS.png'
import '../styles/login.css'
import { User } from '../types'

function Login() {
  const { control, handleSubmit } = useForm()
  const dispatch = useDispatch<AppDispatch>()
  const authUser = useSelector<IRootState, User>((x) => x.user.user)
  const authError = useSelector((x: IRootState) => x.user.error)

  useEffect(() => {
    // redirect to home if already logged in
    if (authUser) history.navigate('/')
  }, [])

  const submitEvent = (data: any) => {
    dispatch(authActions.login(data))
  }

  const register = () => {
    history.navigate('/register')
  }
  return (
    <div className="login">
      <Box
        sx={{
          ...basicWidth,
          textAlign: 'center',
        }}
      >
        <img
          style={{ width: 'inherit' }}
          src={LogoOVT}
          alt="Logo Observatorio Vial"
        />
      </Box>
      <Box
        component="form"
        sx={{ ...basicWidth }}
        className="form"
        onSubmit={handleSubmit(submitEvent)}
      >
        <CustomTextField
          type="number"
          control={control}
          name="legajo"
          label="Legajo"
          className="MuiTextField-root"
        />
        <CustomTextField
          type="password"
          control={control}
          name="password"
          label="Contraseña"
          className="MuiTextField-root"
        />
        {authError && (
          <FormHelperText error>{authError.message}</FormHelperText>
        )}
        <Box className="buttons" sx={{ ...basicWidth }}>
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
