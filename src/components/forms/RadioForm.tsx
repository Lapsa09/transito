import React, { Fragment, useEffect, useState } from 'react'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
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
  CustomAutocomplete,
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
  getSingleMovil,
  getSingleOperario,
} from '../../services'

type FormProps<T> = {
  children: JSX.Element[]
  submitEvent: (data: T) => Promise<void>
  handleClose?: () => void
}

type CreateProps<T> = {
  refresh: (data: T) => void
}

type EditProps<T> = {
  id: number
  refresh: (data: T, key: string) => void
  handleClose: () => void
}

function Create<T>({ children, submitEvent }: FormProps<T>) {
  const [open, setOpen] = useState(false)
  const { handleSubmit } = useFormContext<T>()
  const { setError, setSuccess, closeSnackbar, openSB, response } =
    useSnackBar()

  const handleClose = () => {
    setOpen(false)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const submitting = async (data: T) => {
    try {
      await submitEvent(data)
      setSuccess('Cargado con exito')
    } catch (error) {
      setError(error.response?.data)
    } finally {
      handleClose()
    }
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
        <Box component="form" onSubmit={handleSubmit(submitting)}>
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

function Edit<T>({ children, submitEvent, handleClose }: FormProps<T>) {
  const { handleSubmit } = useFormContext<T>()
  const { setError, setSuccess, response, closeSnackbar, openSB } =
    useSnackBar()

  const submitting = async (data: T) => {
    try {
      await submitEvent(data)
      setSuccess('Cargado con exito')
    } catch (error) {
      setError(error.response?.data)
    }
  }

  return (
    <Fragment>
      <Dialog open={true} maxWidth="xl" onClose={handleClose}>
        <Box component="form" onSubmit={handleSubmit(submitting)}>
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
  const methods = useForm<RadioOPForm>()

  const { control } = methods
  const {
    selects: { moviles_radio, estado_operario },
  } = useSelects()

  const submitEvent = async (data) => {
    const res = await postOperarioRadio(data)
    refresh(res)
  }

  return (
    <FormProvider {...methods}>
      <Create submitEvent={submitEvent}>
        <FileNumberField name="legajo" label="Legajo" control={control} />
        <CustomTextField
          control={control}
          name="nombre"
          label="Nombre"
          rules={{ required: 'Este campo es obligatorio' }}
        />
        <CustomAutocomplete
          name="estado"
          label="Estado"
          control={control}
          options={estado_operario}
          labelOption="estado"
        />
        <CustomSelect
          control={control}
          name="movil"
          label="Movil"
          options={moviles_radio}
          optionId="movil"
          optionLabel="movil"
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
    </FormProvider>
  )
}

export const MovilCreateForm = ({ refresh }: CreateProps<RadioMovilForm>) => {
  const methods = useForm<RadioMovilForm>()
  const { control } = methods
  const {
    selects: { estado_movil },
  } = useSelects()

  const submitEvent = async (data) => {
    const res = await postMovilRadio(data)
    refresh(res)
  }

  return (
    <FormProvider {...methods}>
      <Create submitEvent={submitEvent}>
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
          options={estado_movil}
          optionId="id_estado"
          optionLabel="estado"
        />
        <CustomTextField label="Novedades" name="novedades" control={control} />
      </Create>
    </FormProvider>
  )
}

export const OperativosEditForm = ({
  id,
  refresh,
  handleClose,
}: EditProps<RadioOPForm>) => {
  const methods = useForm<RadioOPForm>()
  const { control, setValue } = methods
  const {
    selects: { moviles_radio, estado_operario },
  } = useSelects()

  useEffect(() => {
    getSingleOperario(id).then((data) => {
      setValue('id', data.id)
      setValue('legajo', data.legajo)
      setValue('movil', data.movil)
      setValue('nombre', data.nombre)
      setValue('asistencia', data.asistencia)
      setValue('estado', data.estado)
      setValue('ht', data.ht)
      setValue('qth', data.qth)
      setValue('novedades', data.novedades)
    })
  }, [])

  const submitEvent = async (data) => {
    const res = await editOperarioRadio(data)
    refresh(res, 'legajo')
  }

  return (
    <FormProvider {...methods}>
      <Edit submitEvent={submitEvent} handleClose={handleClose}>
        <FileNumberField name="legajo" label="Legajo" control={control} />
        <CustomTextField name="nombre" label="Nombre" control={control} />
        <CustomSelect
          name="estado"
          label="Estado"
          control={control}
          options={estado_operario}
          optionId="id_estado"
          optionLabel="estado"
        />
        <CustomSelect
          name="movil"
          label="Movil"
          control={control}
          options={moviles_radio}
          optionId="movil"
          optionLabel="movil"
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
    </FormProvider>
  )
}

export const MovilEditForm = ({
  id,
  refresh,
  handleClose,
}: EditProps<RadioMovilForm>) => {
  const methods = useForm<RadioMovilForm>()

  const { control, setValue } = methods
  const {
    selects: { estado_movil },
  } = useSelects()

  useEffect(() => {
    getSingleMovil(id).then((data) => {
      setValue('movil', data.movil)
      setValue('estado', data.estado)
      setValue('novedades', data.novedades)
    })
  }, [])

  const submitEvent = async (data) => {
    const res = await editMovilRadio(data)
    refresh(res, 'movil')
  }

  return (
    <FormProvider {...methods}>
      <Edit submitEvent={submitEvent} handleClose={handleClose}>
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
          options={estado_movil}
          optionId="id_estado"
          optionLabel="estado"
        />
        <CustomTextField label="Novedades" name="novedades" control={control} />
      </Edit>
    </FormProvider>
  )
}
