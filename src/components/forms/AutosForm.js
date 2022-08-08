import React, { useState } from 'react'
import {
  getAllZonas,
  getLicencias,
  getSeguridad,
  getZonasVL,
  nuevoOperativoAuto,
  getMotivos,
} from '../../services/operativosService'
import { getResolucion, getTurnos } from '../../services/index'
import { DOMINIO_PATTERN, LEGAJO_PATTERN, currentDate } from '../../utils'
import { useSelector } from 'react-redux'
import {
  CustomDatePicker,
  CustomTimePicker,
  CustomTextField,
  CustomSelect,
  CustomAutocomplete,
} from '../ui'

import { useForm } from 'react-hook-form'
import Layout from '../../layouts/FormLayout'
import { useSelects } from '../../hooks'
import { Grid } from '@mui/material'

function OperativosForm({ handleClose, afterCreate }) {
  const user = useSelector((x) => x.user.user)
  const handleRol = () => user?.rol === 'ADMIN'
  const {
    handleSubmit,
    control,
    reset,
    getValues,
    watch,
    setValue,
    formState: { isValid },
  } = useForm({
    mode: 'all',
    defaultValues: { lpcarga: user.legajo },
  })
  const [activeStep, setActiveStep] = useState(0)
  const {
    data: [
      licencias,
      zonasVL,
      allZonas,
      turnos,
      seguridad,
      resolucion,
      motivos,
    ],
    error,
  } = useSelects([
    getLicencias(),
    getZonasVL(),
    getAllZonas(),
    getTurnos(),
    getSeguridad(),
    getResolucion(),
    getMotivos(),
  ])

  const steps = () => {
    const [
      legajo_a_cargo,
      legajo_planilla,
      seguridad,
      hora,
      dominio,
      direccion,
      zona,
      zona_infractor,
      resolucion,
      motivo,
      fecha,
      turno,
    ] = watch([
      'legajo_a_cargo',
      'legajo_planilla',
      'seguridad',
      'hora',
      'dominio',
      'direccion',
      'zona',
      'zona_infractor',
      'resolucion',
      'motivo',
      'fecha',
      'turno',
    ])
    return [
      {
        label: 'Operativo',
        values: {
          legajo_a_cargo,
          legajo_planilla,
          seguridad,
          fecha,
          turno,
          direccion,
          zona,
          hora,
        },
      },
      {
        label: 'Vehiculo',
        values: {
          dominio,
          zona_infractor,
          resolucion,
          motivo,
        },
      },
    ]
  }

  const submitEvent = async (data) => {
    await nuevoOperativoAuto(data)
    await afterCreate()
    reset(
      {
        ...data,
        dominio: null,
        zona_infractor: null,
        resolucion: null,
        motivo: null,
        licencia: null,
        tipo_licencia: null,
        graduacion_alcoholica: null,
        acta: null,
        lpcarga: user?.legajo,
      },
      { keepDefaultValues: true }
    )
  }

  return (
    <Layout
      steps={steps()}
      activeStep={activeStep}
      setActiveStep={setActiveStep}
      handleClose={handleClose}
      isValid={isValid}
      handleSubmit={handleSubmit}
      submitEvent={submitEvent}
      error={error}
      path="autos"
      setValue={setValue}
    >
      <Grid container spacing={2} columns={{ xs: 8, md: 16 }}>
        <Grid item xs={8}>
          <CustomDatePicker
            control={control}
            name="fecha"
            disabled={!handleRol()}
            label="Fecha"
            defaultValue={!handleRol() ? currentDate() : null}
          />
        </Grid>
        <Grid item xs={8}>
          <CustomTimePicker
            control={control}
            name="hora"
            disabled={!handleRol()}
            label="Hora"
            defaultValue={!handleRol() ? currentDate() : null}
          />
        </Grid>
        <Grid item xs={8}>
          <CustomTextField
            control={control}
            name="legajo_a_cargo"
            type="number"
            label="Legajo a cargo"
            rules={{
              required: 'Inserte un legajo',
              pattern: {
                value: LEGAJO_PATTERN,
                message: 'Inserte un legajo valido',
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
              required: 'Inserte un legajo',
              pattern: {
                value: LEGAJO_PATTERN,
                message: 'Inserte un legajo valido',
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
            options={turnos}
            defaultValue={!handleRol() ? user.turno : null}
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
        <Grid item xs={8}>
          <CustomTextField
            control={control}
            name="direccion"
            label="Direccion"
            rules={{ required: 'Inserte una direccion valida' }}
          />
        </Grid>
        <Grid item xs={8}>
          <CustomSelect
            control={control}
            name="zona"
            label="Zona"
            rules={{ required: 'Elija una localidad' }}
            options={zonasVL}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} columns={{ xs: 8, md: 16 }}>
        <Grid item xs={8}>
          <CustomTextField
            control={control}
            name="dominio"
            label="Dominio"
            rules={{
              required: 'Inserte una patente',
              pattern: {
                value: DOMINIO_PATTERN,
                message: 'Inserte una patente valida',
              },
            }}
          />
        </Grid>
        <Grid item xs={8}>
          <CustomTextField
            type="number"
            control={control}
            name="licencia"
            label="Licencia"
          />
        </Grid>
        <Grid item xs={8}>
          <CustomSelect
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
            rules={{ required: 'Elija una opcion' }}
            label="Localidad del infractor"
            options={allZonas}
          />
        </Grid>
        <Grid item xs={8}>
          <CustomSelect
            control={control}
            name="motivo"
            label="Motivo"
            rules={{ required: 'Inserte un motivo' }}
            options={motivos}
          />
        </Grid>
        <Grid item xs={8}>
          <CustomTextField
            type="number"
            control={control}
            name="graduacion_alcoholica"
            label="Graduacion alcoholica"
          />
        </Grid>
        <Grid item xs={8}>
          <CustomSelect
            control={control}
            name="resolucion"
            label="Resolucion"
            rules={{ required: 'Elija una opcion valida' }}
            options={resolucion}
          />
        </Grid>
        {getValues('resolucion') === 'ACTA' && (
          <Grid item xs={8}>
            <CustomTextField
              type="number"
              control={control}
              name="acta"
              label="Acta"
              rules={{
                required: {
                  value: getValues('resolucion') === 'ACTA',
                  message: 'Ingrese un nro de acta',
                },
              }}
            />
          </Grid>
        )}
      </Grid>
    </Layout>
  )
}

export default OperativosForm
