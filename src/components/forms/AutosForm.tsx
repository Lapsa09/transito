import React, { useEffect, useState } from 'react'
import { nuevoOperativoAuto } from '../../services'
import { currentDate } from '../../utils'
import { useSelector } from 'react-redux'
import {
  DatePicker,
  TimePicker,
  CustomTextField,
  CustomSelect,
  CustomAutocomplete,
} from '../ui'
import { useFormContext } from 'react-hook-form'
import Layout from '../../layouts/FormLayout'
import { useSelects } from '../../hooks'
import { Grid } from '@mui/material'
import { IRootState } from '../../redux'
import { FormInputProps, FormProps, IMotivos, User } from '../../types'

interface AutosForm extends FormInputProps {
  motivo?: IMotivos
  graduacion_alcoholica?: number
}

function OperativosForm({ handleClose, afterCreate }: FormProps) {
  const user = useSelector<IRootState, User>((x) => x.user.user)
  const { control, reset, getValues, watch, setValue, setFocus } =
    useFormContext<AutosForm>()

  const [activeStep, setActiveStep] = useState(0)
  const {
    selects: {
      turnos,
      seguridad,
      vicente_lopez,
      licencias,
      resolucion,
      motivos,
      barrios,
    },
    error,
  } = useSelects()

  const steps = () => {
    const {
      legajo_a_cargo,
      legajo_planilla,
      seguridad,
      fecha,
      turno,
      direccion,
      zona,
      hora,
      dominio,
      zona_infractor,
      resolucion,
      motivo,
      acta,
    } = watch()
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
          acta,
        },
      },
    ]
  }

  const esSancionable =
    getValues('resolucion') === 'ACTA' || getValues('resolucion') === 'REMITIDO'

  const submitEvent = async (data: AutosForm) => {
    const res = await nuevoOperativoAuto(data)
    afterCreate(res)
    setFocus('dominio')
    reset(
      {
        ...data,
        dominio: '',
        zona_infractor: null,
        motivo: null,
        licencia: undefined,
        tipo_licencia: null,
        graduacion_alcoholica: undefined,
        acta: undefined,
        extranjero: false,
      },
      { keepDefaultValues: true }
    )
  }

  useEffect(() => {
    if (!esSancionable) {
      setValue('acta', undefined)
      setValue('motivo', null)
    }
  }, [esSancionable])

  return (
    <Layout
      steps={steps()}
      activeStep={activeStep}
      setActiveStep={setActiveStep}
      handleClose={handleClose}
      submitEvent={submitEvent}
      error={error}
      path="autos"
    >
      <Grid container spacing={2} columns={{ xs: 8, md: 16 }}>
        <Grid item xs={8}>
          <DatePicker
            control={control}
            name="fecha"
            disabled={!user.isAdmin()}
            label="Fecha"
            defaultValue={!user.isAdmin() ? currentDate() : null}
          />
        </Grid>
        <Grid item xs={8}>
          <TimePicker control={control} name="hora" label="Hora" />
        </Grid>
        <Grid item xs={8}>
          <CustomTextField.LEGAJO
            control={control}
            name="legajo_a_cargo"
            label="Legajo a Cargo"
          />
        </Grid>
        <Grid item xs={8}>
          <CustomTextField.LEGAJO
            control={control}
            name="legajo_planilla"
            label="Legajo Planilla"
          />
        </Grid>
        <Grid item xs={8}>
          <CustomSelect
            control={control}
            name="turno"
            label="Turno"
            rules={{ required: 'Elija una opcion' }}
            disabled={!user.isAdmin()}
            options={turnos}
            defaultValue={!user.isAdmin() ? user.turno : null}
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
          <CustomAutocomplete
            control={control}
            name="zona"
            label="Zona"
            rules={{ required: 'Elija una localidad' }}
            options={vicente_lopez}
            labelOption="barrio"
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} columns={{ xs: 8, md: 16 }}>
        <Grid item xs={8}>
          <CustomTextField.DOMINIO control={control} name="dominio" />
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
          <CustomAutocomplete
            control={control}
            name="tipo_licencia"
            label="Tipo de licencia"
            options={licencias}
            labelOption="tipo"
          />
        </Grid>
        <Grid item xs={8}>
          <CustomAutocomplete
            control={control}
            name="zona_infractor"
            rules={{ required: 'Elija una opcion' }}
            label="Localidad del infractor"
            options={barrios}
            labelOption="barrio"
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
            options={resolucion}
          />
        </Grid>
        {esSancionable && (
          <>
            <Grid item xs={8}>
              <CustomAutocomplete
                control={control}
                name="motivo"
                label="Motivo"
                options={motivos}
                labelOption="motivo"
              />
            </Grid>
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
          </>
        )}
      </Grid>
    </Layout>
  )
}

export default OperativosForm
