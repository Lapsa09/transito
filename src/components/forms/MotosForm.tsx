import React, { Fragment, useEffect, useState } from 'react'
import { nuevoOperativoMoto } from '../../services'
import {
  DatePicker,
  TimePicker,
  CustomTextField,
  CustomSelect,
  CustomAutocomplete,
} from '../ui'
import { currentDate } from '../../utils'
import { useSelector } from 'react-redux'
import { AddBoxSharp, IndeterminateCheckBoxSharp } from '@mui/icons-material'
import { useForm, useFieldArray, FormProvider } from 'react-hook-form'
import Layout from '../../layouts/FormLayout'
import { useSelects } from '../../hooks'
import { Grid } from '@mui/material'
import { IRootState } from '../../redux'
import { FormProps, User, FormInputProps, Roles, IMotivos } from '../../types'

interface IMotosForm extends FormInputProps {
  motivos?: IMotivos[]
}

function MotosForm({ handleClose, afterCreate }: FormProps) {
  const user = useSelector<IRootState, User>((x) => x.user.user)
  const methods = useForm<IMotosForm>({
    mode: 'all',
    defaultValues: {
      motivos: [],
      lpcarga: user.legajo,
    },
  })
  const { control, reset, getValues, setValue, watch, setFocus } = methods
  const { append, remove, fields } = useFieldArray({
    control,
    name: 'motivos',
  })
  const {
    selects: {
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
    const {
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
    } = watch()
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
      setValue('acta', undefined)
    }
  }, [esSancionable])

  const submitEvent = async (data: IMotosForm) => {
    const res = await nuevoOperativoMoto(data)
    afterCreate(res)
    setFocus('dominio')
    reset(
      {
        ...data,
        dominio: '',
        licencia: undefined,
        tipo_licencia: null,
        zona_infractor: null,
        acta: undefined,
        extranjero: false,
      },
      { keepDefaultValues: true }
    )
  }

  return (
    <FormProvider {...methods}>
      <Layout
        error={error}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        submitEvent={submitEvent}
        path="motos"
        steps={steps()}
        handleClose={handleClose}
      >
        <Grid container spacing={2} columns={{ xs: 8, md: 16 }}>
          <Grid item xs={8}>
            <DatePicker
              control={control}
              name="fecha"
              label="Fecha"
              disabled={!user.isAdmin()}
              defaultValue={!user.isAdmin() ? currentDate : ''}
            />
          </Grid>
          <Grid item xs={8}>
            <TimePicker control={control} name="hora" label="Hora" />
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
              labelOption="barrio"
            />
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
              defaultValue={!user.isAdmin() ? user.turno : ''}
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
              <AddBoxSharp onClick={sumarMotivos} />
              <IndeterminateCheckBoxSharp onClick={restarMotivos} />
            </Grid>
          )}
          <Grid item xs={8}>
            <CustomTextField.DOMINIO control={control} name="dominio" />
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
              labelOption="tipo"
            />
          </Grid>
          <Grid item xs={8}>
            <CustomAutocomplete
              control={control}
              name="zona_infractor"
              label="Localidad del infractor"
              rules={{ required: 'Elija una opcion' }}
              options={barrios}
              labelOption="barrio"
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
                    labelOption="motivo"
                  />
                </Grid>
              ))}
            </Fragment>
          )}
        </Grid>
      </Layout>
    </FormProvider>
  )
}

export default MotosForm
