import React, { Fragment, useEffect } from 'react'
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
import { FormProps, User, FormInputProps, IMotivos } from '../../types'

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
  const { selects, error } = useSelects()

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

  const firstStep = {
    fecha,
    hora,
    direccion,
    zona,
    legajo_a_cargo,
    legajo_planilla,
    turno,
    seguridad,
  }

  const secondStep = {
    dominio,
    licencia,
    tipo_licencia,
    zona_infractor,
    resolucion,
    acta,
    motivos,
  }

  const steps = [firstStep, secondStep]

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
        submitEvent={submitEvent}
        path="motos"
        steps={steps}
        handleClose={handleClose}
      >
        <Grid container spacing={2} columns={{ xs: 8, md: 16 }}>
          <Grid item xs={8}>
            <DatePicker
              name="fecha"
              label="Fecha"
              disabled={!user.isAdmin()}
              defaultValue={!user.isAdmin() ? currentDate() : ''}
            />
          </Grid>
          <Grid item xs={8}>
            <TimePicker name="hora" label="Hora" />
          </Grid>
          <Grid item xs={8}>
            <CustomTextField
              name="direccion"
              label="Direccion"
              rules={{ required: 'Ingrese una direccion valida' }}
            />
          </Grid>
          <Grid item xs={8}>
            <CustomAutocomplete
              name="zona"
              label="Zona"
              rules={{ required: 'Elija una localidad' }}
              options={selects.vicente_lopez}
              labelOption="barrio"
            />
          </Grid>
          <Grid item xs={8}>
            <CustomTextField.LEGAJO
              name="legajo_a_cargo"
              label="Legajo a Cargo"
            />
          </Grid>
          <Grid item xs={8}>
            <CustomTextField.LEGAJO
              name="legajo_planilla"
              label="Legajo Planilla"
            />
          </Grid>
          <Grid item xs={8}>
            <CustomSelect
              name="turno"
              label="Turno"
              rules={{ required: 'Elija una opcion' }}
              disabled={!user.isAdmin()}
              defaultValue={!user.isAdmin() ? user.turno : ''}
              options={selects.turnos}
            />
          </Grid>
          <Grid item xs={8}>
            <CustomSelect
              name="seguridad"
              label="Seguridad"
              options={selects.seguridad}
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
            <CustomTextField.DOMINIO name="dominio" />
          </Grid>
          <Grid item xs={8}>
            <CustomTextField type="number" name="licencia" label="Licencia" />
          </Grid>
          <Grid item xs={8}>
            <CustomAutocomplete
              name="tipo_licencia"
              label="Tipo de licencia"
              options={selects.licencias}
              labelOption="tipo"
            />
          </Grid>
          <Grid item xs={8}>
            <CustomAutocomplete
              name="zona_infractor"
              label="Localidad del infractor"
              rules={{ required: 'Elija una opcion' }}
              options={selects.barrios}
              labelOption="barrio"
            />
          </Grid>
          <Grid item xs={8}>
            <CustomSelect
              name="resolucion"
              label="Resolucion"
              options={selects.resolucion}
            />
          </Grid>
          {esSancionable && (
            <Fragment>
              <Grid item xs={8}>
                <CustomTextField
                  type="number"
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
                    key={item.id}
                    name={`motivos.${index}`}
                    label={`Motivo ${index + 1}`}
                    options={selects.motivos}
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
