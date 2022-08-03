import React, { useState } from 'react'
import {
  getAllZonas,
  getLicencias,
  getMotivosMoto,
  getSeguridad,
  getZonasVL,
  nuevoOperativoMoto,
} from '../../services/operativosService'
import {
  CustomDatePicker,
  CustomTimePicker,
  CustomTextField,
  CustomSelect,
  CustomAutocomplete,
} from '../ui'
import { getResolucion, getTurnos } from '../../services/index'
import { DOMINIO_PATTERN, LEGAJO_PATTERN, currentDate } from '../../utils'
import { useSelector } from 'react-redux'

import AddBoxSharpIcon from '@mui/icons-material/AddBoxSharp'
import IndeterminateCheckBoxSharpIcon from '@mui/icons-material/IndeterminateCheckBoxSharp'
import { useForm, useFieldArray } from 'react-hook-form'
import Layout from '../../layouts/FormLayout'
import { useSelects } from '../../hooks'
import { Grid } from '@mui/material'

function MotosForm({ handleClose, afterCreate }) {
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
      motivos: [{ motivo: null }],
      lpcarga: user.legajo,
    },
  })
  const { append, remove, fields } = useFieldArray({
    control,
    name: 'motivos',
  })
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
    getMotivosMoto(),
  ])
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
      motivo1,
      motivo2,
      motivo3,
      motivo4,
      motivo5,
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
      'motivo1',
      'motivo2',
      'motivo3',
      'motivo4',
      'motivo5',
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
          motivo1,
          motivo2,
          motivo3,
          motivo4,
          motivo5,
        },
      },
    ]
  }

  const sumarMotivos = () => {
    if (fields.length < 5) {
      append({ motivo: null })
    }
  }

  const restarMotivos = () => {
    if (fields.length > 1) {
      remove(fields.at(-1))
    }
  }

  const submitEvent = async (data) => {
    await nuevoOperativoMoto(data)
    await afterCreate()
    reset(
      {
        ...data,
        dominio: '',
        licencia: '',
        tipo_licencia: null,
        zona_infractor: null,
        motivos: [{ motivo: '' }],
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
      handleClose={handleClose}
    >
      <Grid container spacing={2} columns={{ sm: 8, md: 16 }}>
        <Grid item xs={8}>
          <CustomDatePicker
            control={control}
            name="fecha"
            label="Fecha"
            disabled={!handleRol()}
            defaultValue={!handleRol() ? currentDate() : null}
          />
        </Grid>
        <Grid item xs={8}>
          <CustomTimePicker
            control={control}
            name="hora"
            label="Hora"
            disabled={!handleRol()}
            defaultValue={!handleRol() ? currentDate() : null}
          />
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
          <CustomSelect
            control={control}
            name="zona"
            label="Zona"
            rules={{ required: 'Elija una localidad' }}
            options={zonasVL}
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
            defaultValue={!handleRol() ? user.turno : null}
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
      <Grid container spacing={2} columns={{ sm: 8, md: 16 }}>
        <Grid container justifyContent="center" alignItems="center">
          <h4>Motivos: {fields.length}</h4>
          <AddBoxSharpIcon onClick={sumarMotivos} />
          <IndeterminateCheckBoxSharpIcon onClick={restarMotivos} />
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
          <CustomTextField
            control={control}
            type="number"
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
            label="Localidad del infractor"
            rules={{ required: 'Elija una opcion' }}
            options={allZonas}
          />
        </Grid>
        {fields.map((item, index) => (
          <Grid key={index} item xs={8}>
            <CustomSelect
              control={control}
              key={item.id}
              name={`motivos.${index}.motivo`}
              label={`Motivo ${index + 1}`}
              options={motivos}
            />
          </Grid>
        ))}
        <Grid item xs={8}>
          <CustomSelect
            control={control}
            name="resolucion"
            label="Resolucion"
            rules={{ required: 'Elija una opcion valida' }}
            options={resolucion}
          />
        </Grid>
        {(getValues('resolucion') === 'ACTA' ||
          getValues('resolucion') === 'REMITIDO') && (
          <Grid item xs={8}>
            <CustomTextField
              type="number"
              control={control}
              name="acta"
              label="Acta"
              rules={{
                required: {
                  value:
                    getValues('resolucion') === 'ACTA' ||
                    getValues('resolucion') === 'REMITIDO',
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

export default MotosForm
