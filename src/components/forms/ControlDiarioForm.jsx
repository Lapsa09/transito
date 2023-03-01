import React, { useState } from 'react'
import {
  getLocalidades,
  getMotivos,
  nuevoControl,
} from '../../services/controlDiarioService'
import { getResolucion, getTurnos } from '../../services/index'
import { useSelector } from 'react-redux'
import { FormProvider, useForm } from 'react-hook-form'
import {
  CustomDatePicker,
  CustomTimePicker,
  CustomTextField,
  CustomSelect,
  CustomAutocomplete,
  FileNumberField,
  DomainField,
} from '../ui'
import { currentDate } from '../../utils'
import Layout from '../../layouts/FormLayout'
import { useSelects } from '../../hooks'
import { Grid } from '@mui/material'

function ControlDiarioForm({ handleClose, afterCreate }) {
  const user = useSelector((x) => x.user.user)
  const handleRol = () => user.rol === 'ADMIN'
  const {
    handleSubmit,
    control,
    reset,
    getValues,
    watch,
    formState,
    setValue,
    trigger,
  } = useForm({
    mode: 'all',
    defaultValues: {
      lpcarga: user?.legajo,
      lp: !handleRol() ? user?.legajo : '',
    },
  })
  const {
    data: [localidades, motivos, turnos, resolucion],
    error,
  } = useSelects([getLocalidades(), getMotivos(), getTurnos(), getResolucion()])
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      label: 'Operativo',
      values: {
        ...watch(['fecha', 'turno', 'lp']),
      },
    },
    {
      label: 'Vehiculo',
      values: {
        ...watch([
          'hora',
          'direccion',
          'dominio',
          'resolucion',
          'motivo',
          'localidad',
          'acta',
          'otroMotivo',
        ]),
      },
    },
  ]

  const submitting = async (data) => {
    await nuevoControl(data)
    reset(
      {
        ...data,
        hora: null,
        direccion: '',
        resolucion: null,
        dominio: '',
        localidad: null,
        motivo: null,
        otroMotivo: null,
        acta: null,
      },
      { keepDefaultValues: true }
    )
    if (handleRol()) {
      await afterCreate()
    } else {
      setTimeout(handleClose, 2000)
    }
  }

  return (
    <FormProvider
      formState={formState}
      handleSubmit={handleSubmit}
      setValue={setValue}
      reset={reset}
      trigger={trigger}
    >
      <Layout
        steps={steps}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        handleClose={handleClose}
        submitEvent={submitting}
        error={error}
        path="diario"
      >
        <Grid container spacing={2} columns={{ xs: 8, md: 16 }}>
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
          <Grid item xs={8}>
            <FileNumberField
              control={control}
              name="legajo_planilla"
              label="Legajo Planilla"
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} columns={{ xs: 8, md: 16 }}>
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
            <CustomTextField
              control={control}
              name="direccion"
              rules={{ required: 'Ingrese una direccion valida' }}
              label="Direccion"
            />
          </Grid>
          <Grid item xs={8}>
            <CustomAutocomplete
              control={control}
              name="localidad"
              rules={{ required: 'Elija una opcion' }}
              label="Localidad"
              options={localidades}
            />
          </Grid>
          <Grid item xs={8}>
            <DomainField control={control} name="dominio" />
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
            <CustomSelect
              control={control}
              name="motivo"
              rules={{ required: 'Elija una opcion' }}
              label="Motivo"
              options={motivos}
            />
          </Grid>
          {motivos?.length > 0 && getValues('motivo').motivo === 'OTRO' && (
            <Grid item xs={8}>
              <CustomTextField
                control={control}
                name="otroMotivo"
                rules={{
                  required: {
                    value: getValues('motivo').motivo === 'OTRO',
                    message: 'Inserte un motivo valido',
                  },
                }}
                label="Otro motivo"
              />
            </Grid>
          )}
        </Grid>
      </Layout>
    </FormProvider>
  )
}

export default ControlDiarioForm
