import React, { useEffect } from 'react'
import { nuevoOperativoCamiones } from '../../services'
import { currentDate } from '../../utils'
import { useSelector } from 'react-redux'
import { FormProvider, useForm } from 'react-hook-form'
import {
  DatePicker,
  TimePicker,
  CustomTextField,
  CustomSelect,
  CustomAutocomplete,
  CustomSwitch,
} from '../ui'
import Layout from '../../layouts/FormLayout'
import { useSelects } from '../../hooks'
import { Grid } from '@mui/material'
import { IRootState } from '../../redux/store'
import { FormInputProps, FormProps, IBarrio, IMotivos, User } from '../../types'

interface CamionesForm extends FormInputProps {
  localidad_destino: IBarrio
  remito: boolean
  carga: boolean
  origen: string
  destino: string
  localidad_origen: IBarrio
  legajo: number
  motivo: IMotivos
}

function OperativosForm({ handleClose, afterCreate }: FormProps) {
  const user = useSelector<IRootState, User>((x) => x.user.user)
  const methods = useForm<CamionesForm>({
    mode: 'all',
    defaultValues: { lpcarga: user.legajo },
  })
  const { reset, getValues, watch, setValue, setFocus } = methods
  const { selects, error } = useSelects()

  const {
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
  } = watch()

  const firstStep = {
    fecha,
    legajo,
    direccion,
    zona,
    turno,
  }

  const secondStep = {
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
  }

  const steps = [firstStep, secondStep]

  const submitEvent = async (data: CamionesForm) => {
    const res = await nuevoOperativoCamiones(data)
    afterCreate(res)
    setFocus('hora')
    reset(
      {
        ...data,
        dominio: '',
        licencia: undefined,
        origen: '',
        localidad_origen: null,
        destino: '',
        localidad_destino: null,
        remito: false,
        carga: false,
        motivo: null,
        acta: undefined,
        extranjero: false,
      },
      { keepDefaultValues: true }
    )
  }

  const esSancionable =
    getValues('resolucion') === 'ACTA' || getValues('resolucion') === 'REMITIDO'

  useEffect(() => {
    if (!esSancionable) {
      setValue('acta', undefined)
      setValue('motivo', null)
    }
  }, [esSancionable])

  return (
    <FormProvider {...methods}>
      <Layout
        error={error}
        steps={steps}
        handleClose={handleClose}
        submitEvent={submitEvent}
        path="camiones"
      >
        <Grid container spacing={2} columns={{ xs: 8, md: 16 }}>
          <Grid item xs={8}>
            <DatePicker
              name="fecha"
              label="Fecha"
              disabled={!user.isAdmin()}
              // defaultValue={!user.isAdmin() ? currentDate() : ''}
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
              rules={{ required: 'Inserte una localidad' }}
              options={selects.vicente_lopez}
              labelOption="barrio"
            />
          </Grid>
          <Grid item xs={8}>
            <CustomTextField.LEGAJO name="legajo" label="Legajo" />
          </Grid>
          <Grid item xs={8}>
            <CustomSelect
              name="turno"
              label="Turno"
              rules={{ required: 'Elija una opcion' }}
              options={selects.turnos}
              disabled={!user.isAdmin()}
              defaultValue={!user.isAdmin() ? user.turno : ''}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} columns={{ xs: 8, md: 16 }}>
          <Grid item xs={8}>
            <TimePicker
              name="hora"
              label="Hora"
              disabled={!user.isAdmin()}
              defaultValue={!user.isAdmin() ? currentDate() : ''}
            />
          </Grid>
          <Grid item xs={8}>
            <CustomTextField.DOMINIO name="dominio" />
          </Grid>
          <Grid item xs={8}>
            <CustomTextField name="origen" label="Origen" />
          </Grid>
          <Grid item xs={8}>
            <CustomAutocomplete
              name="localidad_origen"
              label="Localidad de origen"
              rules={{ required: 'Elija una opcion' }}
              options={selects.barrios}
              labelOption="barrio"
            />
          </Grid>
          <Grid item xs={8}>
            <CustomTextField name="destino" label="Destino" />
          </Grid>
          <Grid item xs={8}>
            <CustomAutocomplete
              name="localidad_destino"
              label="Localidad de destino"
              rules={{ required: 'Elija una opcion' }}
              options={selects.barrios}
              labelOption="barrio"
            />
          </Grid>
          <Grid item xs={8}>
            <CustomTextField name="licencia" label="Licencia" />
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
              <CustomSwitch name="remito" label="Remito" />
            </Grid>
            <Grid item xs={4}>
              <CustomSwitch name="carga" label="Carga" />
            </Grid>
          </Grid>
          <Grid item xs={8}>
            <CustomSelect
              name="resolucion"
              label="Resolucion"
              options={selects.resolucion}
            />
          </Grid>
          {esSancionable && (
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
          )}
          {esSancionable && (
            <Grid item xs={8}>
              <CustomAutocomplete
                name="motivo"
                label="Motivo"
                options={selects.motivos}
                rules={{ required: 'Inserte un motivo valido' }}
                labelOption="motivo"
              />
            </Grid>
          )}
        </Grid>
      </Layout>
    </FormProvider>
  )
}

export default OperativosForm
