import React, { useEffect } from 'react'
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
import { FormProvider, useForm } from 'react-hook-form'
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
  const methods = useForm<AutosForm>({
    mode: 'all',
    defaultValues: { lpcarga: user.legajo },
  })
  const { reset, getValues, watch, setValue, setFocus } = methods
  const { selects, error } = useSelects()

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
    licencia,
    tipo_licencia,
    graduacion_alcoholica,
    acta,
    extranjero,
  } = watch()

  const firstStep = {
    legajo_a_cargo,
    legajo_planilla,
    seguridad,
    fecha,
    turno,
    direccion,
    zona,
    hora,
  }

  const secondStep = {
    dominio,
    zona_infractor,
    resolucion,
    motivo,
    licencia,
    tipo_licencia,
    graduacion_alcoholica,
    acta,
    extranjero,
  }

  const steps = [firstStep, secondStep]

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
    <FormProvider {...methods}>
      <Layout
        steps={steps}
        handleClose={handleClose}
        submitEvent={submitEvent}
        error={error}
        path="autos"
      >
        <Grid container spacing={2} columns={{ xs: 8, md: 16 }}>
          <Grid item xs={8}>
            <DatePicker
              name="fecha"
              disabled={!user.isAdmin()}
              label="Fecha"
              defaultValue={!user.isAdmin() ? currentDate() : ''}
            />
          </Grid>
          <Grid item xs={8}>
            <TimePicker name="hora" label="Hora" />
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
              options={selects.turnos}
              defaultValue={!user.isAdmin() ? user.turno : ''}
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
          <Grid item xs={8}>
            <CustomTextField
              name="direccion"
              label="Direccion"
              rules={{ required: 'Inserte una direccion valida' }}
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
        </Grid>
        <Grid container spacing={2} columns={{ xs: 8, md: 16 }}>
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
              rules={{ required: 'Elija una opcion' }}
              label="Localidad del infractor"
              options={selects.barrios}
              labelOption="barrio"
            />
          </Grid>
          <Grid item xs={8}>
            <CustomTextField
              type="number"
              name="graduacion_alcoholica"
              label="Graduacion alcoholica"
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
            <>
              <Grid item xs={8}>
                <CustomAutocomplete
                  name="motivo"
                  label="Motivo"
                  options={selects.motivos}
                  labelOption="motivo"
                />
              </Grid>
              <Grid item xs={8}>
                <CustomTextField
                  type="number"
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
    </FormProvider>
  )
}

export default OperativosForm
