import React, { Fragment, useEffect, useState } from 'react'
import { nuevoOperativoMoto } from 'services/operativosService'
import {
  CustomDatePicker,
  CustomTimePicker,
  CustomTextField,
  CustomSelect,
  CustomAutocomplete,
} from '../ui'
import { DOMINIO_PATTERN, LEGAJO_PATTERN, currentDate } from 'utils'
import { useSelector } from 'react-redux'

import AddBoxSharpIcon from '@mui/icons-material/AddBoxSharp'
import IndeterminateCheckBoxSharpIcon from '@mui/icons-material/IndeterminateCheckBoxSharp'
import { useForm, useFieldArray } from 'react-hook-form'
import Layout from 'layouts/FormLayout'
import { useSelects } from 'hooks'
import { Grid } from '@mui/material'
import { IRootState } from '@redux/store'
import { FormProps } from 'types/Misc'

interface MotosForm extends FormInputProps {
  motivos?: { id_motivo: number; motivo: string }[]
}

function MotosForm({ handleClose, afterCreate }: FormProps) {
  const user = useSelector((x: IRootState) => x.user.user)
  const handleRol = () => user?.rol === 'ADMIN'
  const {
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    watch,
    formState: { isValid },
    setFocus,
  } = useForm<MotosForm>({
    mode: 'all',
    defaultValues: {
      motivos: [],
      lpcarga: user.legajo,
    },
  })
  const { append, remove, fields } = useFieldArray({
    control,
    name: 'motivos',
  })
  const {
    data: {
      licencias,
      vicente_lopez,
      barrios,
      turnos,
      seguridad,
      resolucion,
      motivos,
    },
    error,
  } = useSelects()
  const [activeStep, setActiveStep] = useState(0)

  const steps = () => {
    const [
      fecha,
      hora,
      direccion,
      zona,
      legajo_a_cargo,
      legajo_planilla,
      turno,
      seguridad,
      dominio,
      licencia,
      tipo_licencia,
      zona_infractor,
      resolucion,
      acta,
      motivos,
    ] = watch([
      'fecha',
      'hora',
      'direccion',
      'zona',
      'legajo_a_cargo',
      'legajo_planilla',
      'turno',
      'seguridad',
      'dominio',
      'licencia',
      'tipo_licencia',
      'zona_infractor',
      'resolucion',
      'acta',
      'motivos',
    ])

    return [
      {
        label: 'Operativo',
        values: {
          fecha,
          hora,
          direccion,
          zona,
          legajo_a_cargo,
          legajo_planilla,
          turno,
          seguridad,
        },
      },
      {
        label: 'Vehiculo',
        values: {
          dominio,
          licencia,
          tipo_licencia,
          zona_infractor,
          resolucion,
          acta,
          motivos,
        },
      },
    ]
  }

  const sumarMotivos = () => {
    if (fields.length < 5) {
      append({ id_motivo: null, motivo: '' })
    }
  }

  const restarMotivos = () => {
    if (fields.length > 1) {
      remove(-1)
    }
  }

  const esSancionable =
    getValues('resolucion') === 'ACTA' || getValues('resolucion') === 'REMITIDO'

  useEffect(() => {
    if (esSancionable) {
      if (fields.length === 0) {
        sumarMotivos()
      }
    } else {
      remove()
      setValue('acta', null)
    }
  }, [esSancionable])

  const submitEvent = async (data: MotosForm) => {
    const res = await nuevoOperativoMoto(data)
    afterCreate(res)
    setFocus('dominio')
    reset(
      {
        ...data,
        dominio: '',
        licencia: null,
        tipo_licencia: null,
        zona_infractor: null,
        acta: null,
      },
      { keepDefaultValues: true }
    )
  }

  return (
    <Layout
      error={error}
      activeStep={activeStep}
      setActiveStep={setActiveStep}
      handleSubmit={handleSubmit}
      submitEvent={submitEvent}
      isValid={isValid}
      path="motos"
      setValue={setValue}
      steps={steps()}
      reset={reset}
      handleClose={handleClose}
    >
      <Grid container spacing={2} columns={{ xs: 8, md: 16 }}>
        <Grid item xs={8}>
          <CustomDatePicker
            control={control}
            name="fecha"
            label="Fecha"
            disabled={!handleRol()}
            defaultValue={!handleRol() ? currentDate() : ''}
          />
        </Grid>
        <Grid item xs={8}>
          <CustomTimePicker control={control} name="hora" label="Hora" />
        </Grid>
        <Grid item xs={8}>
          <CustomTextField
            control={control}
            name="direccion"
            label="Direccion"
            rules={{ required: 'Ingrese una direccion valida' }}
          />
        </Grid>
        <Grid item xs={8}>
          <CustomAutocomplete
            control={control}
            name="zona"
            label="Zona"
            rules={{ required: 'Elija una localidad' }}
            options={vicente_lopez}
          />
        </Grid>
        <Grid item xs={8}>
          <CustomTextField
            control={control}
            type="number"
            name="legajo_a_cargo"
            label="Legajo a cargo"
            rules={{
              required: 'Ingrese un legajo valido',
              pattern: {
                value: LEGAJO_PATTERN,
                message: 'Ingrese un legajo valido',
              },
            }}
          />
        </Grid>
        <Grid item xs={8}>
          <CustomTextField
            control={control}
            type="number"
            name="legajo_planilla"
            label="Legajo planilla"
            rules={{
              required: 'Ingrese un legajo valido',
              pattern: {
                value: LEGAJO_PATTERN,
                message: 'Ingrese un legajo valido',
              },
            }}
          />
        </Grid>
        <Grid item xs={8}>
          <CustomSelect
            control={control}
            name="turno"
            label="Turno"
            rules={{ required: 'Elija una opcion' }}
            disabled={!handleRol()}
            defaultValue={!handleRol() ? user.turno : ''}
            options={turnos}
          />
        </Grid>
        <Grid item xs={8}>
          <CustomSelect
            control={control}
            name="seguridad"
            label="Seguridad"
            options={seguridad}
            rules={{ required: 'Elija una opcion' }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} columns={{ xs: 8, md: 16 }}>
        {esSancionable && (
          <Grid container justifyContent="center" alignItems="center">
            <h4>Motivos: {fields.length}</h4>
            <AddBoxSharpIcon onClick={sumarMotivos} />
            <IndeterminateCheckBoxSharpIcon onClick={restarMotivos} />
          </Grid>
        )}
        <Grid item xs={8}>
          <CustomTextField
            control={control}
            name="dominio"
            label="Dominio"
            rules={{
              required: 'Ingrese una patente valida',
              pattern: {
                value: DOMINIO_PATTERN,
                message: 'Ingrese una patente valida',
              },
            }}
          />
        </Grid>
        <Grid item xs={8}>
          <CustomTextField
            control={control}
            type="number"
            name="licencia"
            label="Licencia"
          />
        </Grid>
        <Grid item xs={8}>
          <CustomAutocomplete
            control={control}
            name="tipo_licencia"
            label="Tipo de licencia"
            options={licencias}
          />
        </Grid>
        <Grid item xs={8}>
          <CustomAutocomplete
            control={control}
            name="zona_infractor"
            label="Localidad del infractor"
            rules={{ required: 'Elija una opcion' }}
            options={barrios}
          />
        </Grid>
        <Grid item xs={8}>
          <CustomSelect
            control={control}
            name="resolucion"
            label="Resolucion"
            options={resolucion}
          />
        </Grid>
        {esSancionable && (
          <Fragment>
            <Grid item xs={8}>
              <CustomTextField
                type="number"
                control={control}
                name="acta"
                label="Acta"
                rules={{
                  required: {
                    value: esSancionable,
                    message: 'Ingrese un nro de acta',
                  },
                }}
              />
            </Grid>
            {fields.map((item, index) => (
              <Grid key={index} item xs={8}>
                <CustomAutocomplete
                  control={control}
                  key={item.id}
                  name={`motivos.${index}`}
                  label={`Motivo ${index + 1}`}
                  options={motivos}
                />
              </Grid>
            ))}
          </Fragment>
        )}
      </Grid>
    </Layout>
  )
}

export default MotosForm
