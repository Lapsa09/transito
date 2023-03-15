import React, { Fragment, useState } from 'react'
import { useForm } from 'react-hook-form'
import EditIcon from '@mui/icons-material/Edit'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { RadioOPForm, RadioMovilForm } from '../../types'
import { useSelects, useSnackBar } from '../../hooks'
import {
  CustomSelect,
  CustomSnackbar,
  CustomSwitch,
  CustomTextField,
  FileNumberField,
} from '../ui'
import {
  postMovilRadio,
  postOperarioRadio,
  editOperarioRadio,
  editMovilRadio,
} from '../../services'

type FormProps = {
  children: JSX.Element[]
  handleSubmit: () => Promise<void>
  closeSnackbar: (_: any, reason: string) => void
  openSB: boolean
  response: {
    severity: 'error' | 'success'
    message: string
  }
}

type CreateProps<T> = {
  refresh: (data: T) => void
}

type EditProps<T> = {
  values: T
  refresh: (data: T) => void
}

const Create = ({
  children,
  handleSubmit,
  closeSnackbar,
  openSB,
  response,
}: FormProps) => {
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const submitEvent = async () => {
    await handleSubmit()
    handleClose()
  }

  return (
    <Fragment>
      <Button
        variant="contained"
        sx={{ marginInline: 'auto' }}
        onClick={handleClickOpen}
      >
        Nuevo
      </Button>
      <Dialog open={open} maxWidth="xl" onClose={handleClose}>
        <Box component="form" onSubmit={submitEvent}>
          <DialogContent
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '20px',
            }}
          >
            {children}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
          </DialogActions>
        </Box>
      </Dialog>
      <CustomSnackbar
        res={response}
        handleClose={closeSnackbar}
        open={openSB}
      />
    </Fragment>
  )
}

const Edit = ({
  children,
  handleSubmit,
  closeSnackbar,
  openSB,
  response,
}: FormProps) => {
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const submitEvent = async () => {
    await handleSubmit()
    handleClose()
  }

  return (
    <Fragment>
      <EditIcon onClick={handleClickOpen}>Nuevo</EditIcon>
      <Dialog open={open} maxWidth="xl" onClose={handleClose}>
        <Box component="form" onSubmit={submitEvent}>
          <DialogContent
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '20px',
            }}
          >
            {children}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
          </DialogActions>
        </Box>
      </Dialog>
      <CustomSnackbar
        res={response}
        handleClose={closeSnackbar}
        open={openSB}
      />
    </Fragment>
  )
}

export const OperativosCreateForm = ({ refresh }: CreateProps<RadioOPForm>) => {
  const { control, handleSubmit } = useForm<RadioOPForm>()
  const {
    selects: { moviles_radio },
  } = useSelects()
  const { setError, setSuccess, ...params } = useSnackBar()

  const submitEvent = async (data) => {
    try {
      const res = await postOperarioRadio(data)
      refresh(res)
      setSuccess('Cargado con exito')
    } catch (error) {
      setError(error.response?.data)
    }
  }

  return (
    <Create handleSubmit={handleSubmit(submitEvent)} {...params}>
      <FileNumberField name="legajo" label="Legajo" control={control} />
      <CustomTextField
        control={control}
        name="nombre"
        label="Nombre"
        rules={{ required: 'Este campo es obligatorio' }}
      />
      <CustomSelect
        name="estado"
        label="Estado"
        control={control}
        options={[
          { id: 1, estado: 'En servicio' },
          { id: 2, estado: 'En reparacion' },
        ]}
      />
      <CustomSelect
        control={control}
        name="movil"
        label="Movil"
        options={moviles_radio}
      />
      <CustomTextField control={control} name="ht" label="HT" />
      <CustomTextField
        control={control}
        name="puntaje"
        type="number"
        label="Puntaje"
      />
      <CustomSwitch control={control} name="asistencia" label="Asistencia" />
      <CustomTextField name="qth" label="QTH" control={control} />
      <CustomTextField name="novedades" label="Novedades" control={control} />
    </Create>
  )
}

export const MovilCreateForm = ({ refresh }: CreateProps<RadioMovilForm>) => {
  const { control, handleSubmit } = useForm<RadioMovilForm>()
  const { setError, setSuccess, ...params } = useSnackBar()

  const submitEvent = async (data) => {
    try {
      const res = await postMovilRadio(data)
      refresh(res)
      setSuccess('Cargado con exito')
    } catch (error) {
      setError(error.response?.data)
    }
  }

  return (
    <Create handleSubmit={handleSubmit(submitEvent)} {...params}>
      <CustomTextField
        name="movil"
        label="Movil"
        type="number"
        control={control}
      />
      <CustomSelect
        name="estado"
        label="Estado"
        control={control}
        options={[
          { id: 1, estado: 'En servicio' },
          { id: 2, estado: 'En reparacion' },
        ]}
      />
      <CustomTextField label="Novedades" name="novedades" control={control} />
    </Create>
  )
}

export const OperativosEditForm = ({
  values,
  refresh,
}: EditProps<RadioOPForm>) => {
  const { control, handleSubmit } = useForm<RadioOPForm>({
    defaultValues: values,
  })

  const {
    selects: { moviles_radio },
  } = useSelects()
  const { setError, setSuccess, ...params } = useSnackBar()

  const submitEvent = async (data) => {
    try {
      const res = await editOperarioRadio(data)
      refresh(res)
      setSuccess('Cargado con exito')
    } catch (error) {
      setError(error.response?.data)
    }
  }

  return (
    <Edit handleSubmit={handleSubmit(submitEvent)} {...params}>
      <FileNumberField name="legajo" label="Legajo" control={control} />
      <CustomTextField name="nombre" label="Nombre" control={control} />
      <CustomSelect
        name="estado"
        label="Estado"
        control={control}
        options={[
          { id: 1, estado: 'En servicio' },
          { id: 2, estado: 'En reparacion' },
        ]}
      />
      <CustomSelect
        name="movil"
        label="Movil"
        control={control}
        options={moviles_radio}
      />
      <CustomTextField control={control} name="ht" label="HT" />
      <CustomTextField
        control={control}
        name="puntaje"
        type="number"
        label="Puntaje"
      />
      <CustomSwitch control={control} name="asistencia" label="Asistencia" />
      <CustomTextField name="qth" label="QTH" control={control} />
      <CustomTextField name="novedades" label="Novedades" control={control} />
    </Edit>
  )
}

export const MovilEditForm = ({
  values,
  refresh,
}: EditProps<RadioMovilForm>) => {
  const { control, handleSubmit } = useForm<RadioMovilForm>({
    defaultValues: values,
  })
  const { setError, setSuccess, ...params } = useSnackBar()

  const submitEvent = async (data) => {
    //TODO
    try {
      const res = await editMovilRadio(data)
      refresh(res)
      setSuccess('Cargado con exito')
    } catch (error) {
      setError(error.response?.data)
    }
  }

  return (
    <Edit handleSubmit={handleSubmit(submitEvent)} {...params}>
      <CustomTextField
        name="movil"
        label="Movil"
        type="number"
        control={control}
      />
      <CustomSelect
        label="Estado"
        name="estado"
        control={control}
        options={[
          { id: 1, estado: 'En servicio' },
          { id: 2, estado: 'En reparacion' },
        ]}
      />
      <CustomTextField label="Novedades" name="novedades" control={control} />
    </Edit>
  )
}
