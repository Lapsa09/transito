import React, { useState } from 'react'
import {
  getLocalidades,
  getMotivosPaseo,
  nuevoControlPaseo,
  getZonasPaseo,
} from '../../services/controlDiarioService'
import {
  CustomDatePicker,
  CustomTimePicker,
  CustomTextField,
  CustomSelect,
  CustomAutocomplete,
} from '../ui'
import { getResolucion, getTurnos } from '../../services/index'

import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { DOMINIO_PATTERN, LEGAJO_PATTERN, currentDate } from '../../utils'
import Layout from '../../layouts/FormLayout'
import { useSelects } from '../../hooks'
import { Grid } from '@mui/material'

function ControlPaseoForm({ handleClose, afterCreate }) {
  const user = useSelector((x) => x.user.user)
  const handleRol = () => user?.rol === 'ADMIN'
  const {
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    watch,
    formState: { isValid },
  } = useForm({
    mode: 'all',
    defaultValues: {
      lpcarga: user?.legajo,
      lp: !handleRol() ? user?.legajo : '',
    },
  })
  const {
    data: [localidades, motivos, turnos, resolucion, zonas],
    error,
  } = useSelects([
    getLocalidades(),
    getMotivosPaseo(),
    getTurnos(),
    getResolucion(),
    getZonasPaseo(),
  ])
  const [activeStep, setActiveStep] = useState(0)

  const steps = () => {
    const [
      fecha,
      hora,
      direccion,
      turno,
      dominio,
      lp,
      resolucion,
      motivo,
      localidadInfractor,
    ] = watch([
      'fecha',
      'hora',
      'direccion',
      'turno',
      'dominio',
      'lp',
      'resolucion',
      'motivo',
      'localidadInfractor',
    ])
    return [
      {
        label: 'Operativo',
        values: {
          fecha,
          turno,
          lp,
          motivo,
        },
      },
      {
        label: 'Vehiculo',
        values: {
          hora,
          dominio,
          direccion,
          resolucion,
          localidadInfractor,
        },
      },
    ]
  }

  const submitting = async (data) => {
    await nuevoControlPaseo(data)
    reset(
      { ...data, dominio: '', localidadInfractor: null },
      { keepDefaultValues: true }
    )
    if (handleRol()) {
      await afterCreate()
    } else {
      setTimeout(handleClose, 2000)
    }
  }

  return (
    <Layout
      steps={steps()}
      activeStep={activeStep}
      setActiveStep={setActiveStep}
      handleClose={handleClose}
      isValid={isValid}
      handleSubmit={handleSubmit}
      submitEvent={submitting}
      error={error}
      reset={reset}
      setValue={setValue}
      path="paseo"
    >
      <Grid container spacing={2} columns={{ sm: 8, md: 16 }}>
        <Grid item xs={8}>
          <CustomDatePicker
            control={control}
            label="Fecha"
            name="fecha"
            defaultValue={!handleRol() ? currentDate() : null}
            disabled={!handleRol()}
          />
        </Grid>
        <Grid item xs={8}>
          <CustomSelect
            control={control}
            name="turno"
            rules={{ required: 'Elija una opcion' }}
            label="Turno"
            defaultValue={!handleRol() ? user.turno : ''}
            disabled={!handleRol()}
            options={turnos}
          />
        </Grid>
        {handleRol() && (
          <Grid item xs={8}>
            <CustomTextField
              type="number"
              control={control}
              name="lp"
              rules={{
                required: {
                  value: handleRol(),
                  message: 'Inserte un legajo valido',
                },
                pattern: {
                  value: LEGAJO_PATTERN,
                  message: 'Inserte un legajo valido',
                },
              }}
              label="Legajo planilla"
            />
          </Grid>
        )}
        <Grid item xs={8}>
          <CustomSelect
            control={control}
            name="motivo"
            rules={{ required: 'Elija una opcion' }}
            label="Motivo"
            options={motivos}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} columns={{ sm: 8, md: 16 }}>
        <Grid item xs={8}>
          <CustomTimePicker
            control={control}
            name="hora"
            label="Hora"
            defaultValue={!handleRol() ? currentDate() : null}
            disabled={!handleRol()}
          />
        </Grid>
        <Grid item xs={8}>
          <CustomSelect
            control={control}
            name="direccion"
            rules={{ required: 'Elija una opcion' }}
            label="Direccion"
            options={zonas}
          />
        </Grid>
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
          <CustomSelect
            control={control}
            name="resolucion"
            rules={{ required: 'Elija una opcion valida' }}
            label="Resolucion"
            options={resolucion}
          />
        </Grid>
        {getValues('resolucion') === 'ACTA' && (
          <Grid item xs={8}>
            <CustomTextField
              type="number"
              control={control}
              name="acta"
              rules={{
                required: {
                  value: getValues('resolucion') === 'ACTA',
                  message: 'Ingrese un Nro de Acta valido',
                },
              }}
              label="Acta"
            />
          </Grid>
        )}
        <Grid item xs={8}>
          <CustomAutocomplete
            control={control}
            name="localidadInfractor"
            rules={{ required: 'Elija una opcion' }}
            label="Localidad del infractor"
            options={localidades}
          />
        </Grid>
      </Grid>
    </Layout>
  )
}

export default ControlPaseoForm
