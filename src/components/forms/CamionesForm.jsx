import React, { useEffect, useState } from 'react'
import {
  getAllZonas,
  getZonasVL,
  nuevoOperativoCamiones,
  getMotivos,
} from '../../services/operativosService'
import { getResolucion, getTurnos } from '../../services/index'
import { DOMINIO_PATTERN, LEGAJO_PATTERN, currentDate } from '../../utils'
import { useSelector } from 'react-redux'

import { useForm } from 'react-hook-form'
import {
  CustomDatePicker,
  CustomTimePicker,
  CustomTextField,
  CustomSelect,
  CustomAutocomplete,
  CustomSwitch,
} from '../ui'
import Layout from '../../layouts/FormLayout'
import { useSelects } from '../../hooks'
import { Checkbox, FormControlLabel, Grid } from '@mui/material'

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
    trigger,
    setFocus,
  } = useForm({
    mode: 'all',
    defaultValues: { lpcarga: user?.legajo },
  })
  const {
    data: [zonasVL, allZonas, turnos, resolucion, motivos],
    error,
  } = useSelects([
    getZonasVL(),
    getAllZonas(),
    getTurnos(),
    getResolucion(),
    getMotivos(),
  ])
  const [activeStep, setActiveStep] = useState(0)
  const [extranjero, setExtranjero] = useState(false)

  const steps = () => {
    const [
      fecha,
      legajo,
      direccion,
      zona,
      turno,
      hora,
      dominio,
      licencia,
      origen,
      localidad_origen,
      destino,
      localidad_destino,
      remito,
      carga,
      acta,
      motivo,
      resolucion,
    ] = watch([
      'fecha',
      'legajo',
      'direccion',
      'zona',
      'turno',
      'hora',
      'dominio',
      'licencia',
      'origen',
      'localidad_origen',
      'destino',
      'localidad_destino',
      'remito',
      'carga',
      'acta',
      'motivo',
      'resolucion',
    ])

    return [
      {
        label: 'Operativo',
        values: {
          fecha,
          legajo,
          turno,
          direccion,
          zona,
        },
      },
      {
        label: 'Vehiculo',
        values: {
          hora,
          dominio,
          licencia,
          origen,
          localidad_origen,
          destino,
          localidad_destino,
          remito,
          carga,
          acta,
          motivo,
          resolucion,
        },
      },
    ]
  }

  const submitEvent = async (data) => {
    const res = await nuevoOperativoCamiones(data)
    afterCreate(res)
    setFocus('dominio')
    setExtranjero(false)
    reset(
      {
        ...data,
        dominio: '',
        licencia: '',
        origen: '',
        localidad_origen: null,
        destino: '',
        localidad_destino: null,
        remito: false,
        carga: false,
        motivo: null,
      },
      { keepDefaultValues: true }
    )
  }

  const esSancionable =
    getValues('resolucion') === 'ACTA' || getValues('resolucion') === 'REMITIDO'

  useEffect(() => {
    if (!esSancionable) {
      setValue('acta', '')
      setValue('motivo', null)
    }
  }, [esSancionable])

  useEffect(() => {
    trigger('dominio')
  }, [extranjero])

  return (
    <Layout
      error={error}
      steps={steps()}
      activeStep={activeStep}
      setActiveStep={setActiveStep}
      handleClose={handleClose}
      isValid={isValid}
      handleSubmit={handleSubmit}
      submitEvent={submitEvent}
      path="camiones"
      reset={reset}
      setValue={setValue}
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
          <CustomTextField
            control={control}
            name="direccion"
            label="Direccion"
            rules={{ required: 'Inserte una direccion valida' }}
          />
        </Grid>
        <Grid item xs={8}>
          <CustomAutocomplete
            control={control}
            name="zona"
            label="Zona"
            rules={{ required: 'Inserte una localidad' }}
            options={zonasVL}
          />
        </Grid>
        <Grid item xs={8}>
          <CustomTextField
            type="number"
            control={control}
            name="legajo"
            label="Legajo"
            rules={{
              required: 'Inserte un legajo valido',
              pattern: {
                value: LEGAJO_PATTERN,
                message: 'Inserte un legajo valido',
              },
            }}
            disabled={!handleRol()}
            defaultValue={!handleRol() ? user.legajo : ''}
          />
        </Grid>
        <Grid item xs={8}>
          <CustomSelect
            control={control}
            name="turno"
            label="Turno"
            rules={{ required: 'Elija una opcion' }}
            options={turnos}
            disabled={!handleRol()}
            defaultValue={!handleRol() ? user.turno : ''}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} columns={{ xs: 8, md: 16 }}>
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
            name="dominio"
            label="Dominio"
            rules={{
              pattern: {
                value: !extranjero ? DOMINIO_PATTERN : /./,
                message: 'Ingrese una patente valida',
              },
              required: 'Ingrese una patente',
            }}
            EndIcon={
              <FormControlLabel
                control={
                  <Checkbox
                    title="Extranjero"
                    tabIndex="-1"
                    value={extranjero}
                    onChange={() => setExtranjero((e) => !e)}
                  />
                }
                label="Extranjero"
              />
            }
          />
        </Grid>
        <Grid item xs={8}>
          <CustomTextField control={control} name="origen" label="Origen" />
        </Grid>
        <Grid item xs={8}>
          <CustomAutocomplete
            control={control}
            name="localidad_origen"
            label="Localidad de origen"
            rules={{ required: 'Elija una opcion' }}
            options={allZonas}
          />
        </Grid>
        <Grid item xs={8}>
          <CustomTextField control={control} name="destino" label="Destino" />
        </Grid>
        <Grid item xs={8}>
          <CustomAutocomplete
            control={control}
            name="localidad_destino"
            label="Localidad de destino"
            rules={{ required: 'Elija una opcion' }}
            options={allZonas}
          />
        </Grid>
        <Grid item xs={8}>
          <CustomTextField control={control} name="licencia" label="Licencia" />
        </Grid>
        <Grid
          item
          container
          md={6}
          sm={12}
          justifyContent="center"
          columnGap={2}
        >
          <Grid item xs={4}>
            <CustomSwitch control={control} name="remito" label="Remito" />
          </Grid>
          <Grid item xs={4}>
            <CustomSwitch control={control} name="carga" label="Carga" />
          </Grid>
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
          <Grid item xs={8}>
            <CustomTextField
              type="number"
              control={control}
              name="acta"
              label="Acta"
              rules={{
                required: 'Ingrese un nro de acta',
              }}
            />
          </Grid>
        )}
        {esSancionable && (
          <Grid item xs={8}>
            <CustomAutocomplete
              control={control}
              name="motivo"
              label="Motivo"
              options={motivos}
              rules={{ required: 'Inserte un motivo valido' }}
            />
          </Grid>
        )}
      </Grid>
    </Layout>
  )
}

export default OperativosForm
