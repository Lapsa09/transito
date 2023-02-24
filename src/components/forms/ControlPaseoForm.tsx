import React, { useState } from 'react'
import {
  getMotivosPaseo,
  nuevoControlPaseo,
  getZonasPaseo,
} from 'services/controlDiarioService'
import {
  CustomDatePicker,
  CustomTimePicker,
  CustomTextField,
  CustomSelect,
} from '../ui'
import { getResolucion, getTurnos } from 'services'

import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { DOMINIO_PATTERN, LEGAJO_PATTERN, currentDate } from 'utils'
import Layout from 'layouts/FormLayout'
import { useSelects } from 'hooks'
import { Grid } from '@mui/material'
import { IRootState } from '@redux/store'
import { FormProps } from 'types/Misc'

interface IFormInputs {
  fecha: string
  hora: string
  direccion: string
  turno: string
  dominio: string
  lp: number
  resolucion: string
  motivo: string
  lpcarga: number
}

function ControlPaseoForm({ handleClose, afterCreate }: FormProps) {
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
  } = useForm<IFormInputs>({
    mode: 'all',
    defaultValues: {
      lpcarga: user?.legajo,
      lp: !handleRol() ? user?.legajo : null,
    },
  })
  const {
    data: [motivos, turnos, resolucion, zonas],
    error,
  } = useSelects([
    getMotivosPaseo(),
    getTurnos(),
    getResolucion(),
    getZonasPaseo(),
  ])
  const [activeStep, setActiveStep] = useState(0)

  const steps = () => {
    const [fecha, hora, direccion, turno, dominio, lp, resolucion, motivo] =
      watch([
        'fecha',
        'hora',
        'direccion',
        'turno',
        'dominio',
        'lp',
        'resolucion',
        'motivo',
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
        },
      },
    ]
  }

  const submitting = async (data: IFormInputs) => {
    const res = await nuevoControlPaseo(data)
    setFocus('dominio')
    reset({ ...data, dominio: '' }, { keepDefaultValues: true })
    if (handleRol()) {
      afterCreate(res)
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
      <Grid container spacing={2} columns={{ xs: 8, md: 16 }}>
        <Grid item xs={8}>
          <CustomDatePicker
            control={control}
            label="Fecha"
            name="fecha"
            defaultValue={!handleRol() ? currentDate() : ''}
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
            disabled={!handleRol()}
            defaultValue={!handleRol() ? user.legajo : ''}
          />
        </Grid>
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
      </Grid>
    </Layout>
  )
}

export default ControlPaseoForm
