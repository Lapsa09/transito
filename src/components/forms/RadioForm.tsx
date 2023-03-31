import React from 'react'
import { Button } from '@mui/material'
import { useCreate, useGetList, useGetOne, useUpdate } from 'react-admin'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { CustomSelect, CustomSwitch, CustomTextField } from '../ui'

export const OperativosCreateForm = () => {
  const navigate = useNavigate()
  const goBack = () => navigate('/radio/operarios')
  const { control, handleSubmit } = useForm()
  const [create, { isLoading: isSubmitting }] = useCreate()
  const { data: moviles } = useGetList('/moviles')
  const { data: estados } = useGetList('/operarios/estado')

  const onSubmit = (data) => {
    create(
      'operarios',
      { data },
      {
        onSuccess: () => {
          goBack()
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CustomTextField.LEGAJO label="Legajo" control={control} name="legajo" />
      <CustomTextField label="Nombre" control={control} name="nombre" />
      <CustomTextField label="QTH" control={control} name="qth" />
      <CustomTextField label="HT" control={control} name="ht" />
      <CustomSelect
        label="Movil"
        control={control}
        name="movil"
        options={moviles}
        optionId="movil"
        optionLabel="movil"
      />
      <CustomSelect
        label="Estado"
        control={control}
        name="estado"
        options={estados}
        optionLabel="estado"
      />
      <CustomSwitch label="Asistencia" control={control} name="asistencia" />
      <CustomTextField
        label="Puntaje"
        control={control}
        name="puntaje"
        type="number"
      />
      <CustomTextField label="Novedades" control={control} name="novedades" />
      <Button onClick={goBack}>Cancelar</Button>
      <Button type="submit" disabled={isSubmitting}>
        Guardar
      </Button>
    </form>
  )
}

export const MovilCreateForm = () => {
  const navigate = useNavigate()
  const goBack = () => navigate('/radio/moviles')
  const { control, handleSubmit } = useForm()
  const [create, { isLoading: isSubmitting }] = useCreate()
  const { data: estados } = useGetList('/moviles/estado')

  const onSubmit = (data) => {
    create(
      'moviles',
      { data },
      {
        onSuccess: () => {
          goBack()
        },
      }
    )
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CustomTextField
        label="Movil"
        control={control}
        name="movil"
        type="number"
      />
      <CustomSelect
        label="Estado"
        control={control}
        name="estado"
        options={estados}
        optionLabel="estado"
      />
      <CustomTextField label="Novedades" control={control} name="novedades" />
      <Button onClick={goBack}>Cancelar</Button>
      <Button type="submit" disabled={isSubmitting}>
        Guardar
      </Button>
    </form>
  )
}

export const OperativosEditForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const goBack = () => navigate('/radio/operarios')
  const { control, handleSubmit, reset } = useForm()
  const [update, { isLoading: isSubmitting }] = useUpdate()
  const { data: moviles } = useGetList('/moviles')
  const { data: estados } = useGetList('/operarios/estado')
  const onSubmit = (data) => {
    update(
      'operarios',
      { data, id },
      {
        onSuccess: () => {
          goBack()
        },
      }
    )
  }
  const { isLoading } = useGetOne(
    'operarios',
    { id },
    { onSuccess: (data) => reset(data) }
  )

  if (isLoading) return null
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CustomTextField.LEGAJO label="Legajo" control={control} name="legajo" />
      <CustomTextField label="Nombre" control={control} name="nombre" />
      <CustomTextField label="QTH" control={control} name="qth" />
      <CustomTextField label="HT" control={control} name="ht" />
      <CustomSelect
        label="Movil"
        control={control}
        name="movil"
        options={moviles}
        optionId="movil"
        optionLabel="movil"
      />
      <CustomSelect
        label="Estado"
        control={control}
        name="estado"
        options={estados}
        optionLabel="estado"
      />
      <CustomSwitch label="Asistencia" control={control} name="asistencia" />
      <CustomTextField
        label="Puntaje"
        control={control}
        name="puntaje"
        type="number"
      />
      <CustomTextField label="Novedades" control={control} name="novedades" />
      <Button onClick={goBack}>Cancelar</Button>
      <Button type="submit" disabled={isSubmitting}>
        Guardar
      </Button>
    </form>
  )
}

export const MovilEditForm = () => {
  const { id } = useParams()
  const [update, { isLoading: isSubmitting }] = useUpdate()
  const { control, handleSubmit, reset } = useForm()
  const { data: estados } = useGetList('/moviles/estado')
  const navigate = useNavigate()
  const onSubmit = (data) => {
    update(
      'moviles',
      { data, id },
      {
        onSuccess: () => {
          navigate('/radio/operarios')
        },
      }
    )
  }
  const { isLoading } = useGetOne(
    'moviles',
    { id },
    { onSuccess: (data) => reset(data) }
  )
  if (isLoading) return null
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CustomTextField
        label="Movil"
        control={control}
        name="movil"
        type="number"
      />
      <CustomSelect
        label="Estado"
        control={control}
        name="estado"
        options={estados}
        optionLabel="estado"
      />
      <CustomTextField label="Novedades" control={control} name="novedades" />
      <Button onClick={() => navigate('/radio/moviles')}>Cancelar</Button>
      <Button type="submit" disabled={isSubmitting}>
        Guardar
      </Button>
    </form>
  )
}
