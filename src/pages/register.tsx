import React, { useEffect } from 'react'
import { Box, Button, FormHelperText } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { CustomTextField } from '../components'
import { basicWidth, history } from '../utils'
import LogoOVT from '../assets/imgs/OVT_LETRAS_NEGRAS.png'
import { AppDispatch, IRootState, authActions, IRootUser } from '../redux'
import '../styles/register.css'

function Register() {
  const { control, handleSubmit, getValues } = useForm()
  const dispatch = useDispatch<AppDispatch>()
  const { user, error } = useSelector<IRootState, IRootUser>((x) => x.user)

  const loginNav = () => {
    history.navigate('/login')
  }

  useEffect(() => {
    if (user) history.navigate('/')
  }, [])

  const submitEvent = async (data) => {
    dispatch(authActions.register(data))
  }

  return (
    <div className="register">
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
        <CustomTextField
          type="password"
          control={control}
          name="password"
          rules={{ required: 'Campo requerido' }}
          label="Contraseña"
        />
        <CustomTextField
          type="password"
          control={control}
          name="confirmPassword"
          rules={{
            validate: {
              confirmPassword: (value) => value === getValues('password'),
            },
          }}
          label="Confirmar contraseña"
        />
        {error && <FormHelperText error>{error.message}</FormHelperText>}
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
  )
}

Register.public = true

export default Register
