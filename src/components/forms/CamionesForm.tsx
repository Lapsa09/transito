import React, { useEffect, useState } from 'react'
import { nuevoOperativoCamiones } from '../../services/operativosService'
import { currentDate } from '../../utils'
import { useSelector } from 'react-redux'
import { FormProvider, useForm } from 'react-hook-form'
import {
  CustomDatePicker,
  CustomTimePicker,
  CustomTextField,
  CustomSelect,
  CustomAutocomplete,
  CustomSwitch,
  DomainField,
  FileNumberField,
} from '../ui'
import Layout from '../../layouts/FormLayout'
import { useSelects } from '../../hooks'
import { Grid } from '@mui/material'
import { IRootState } from '../../redux/store'
import { FormInputProps, FormProps, Roles, User } from '../../types'

interface CamionesForm extends FormInputProps {
  localidad_destino: { id: number; zona_infractor: string }
  remito: boolean
  carga: boolean
  origen: string
  destino: string
  localidad_origen: { id: number; zona_infractor: string }
  legajo: number
  motivo: { id_motivo: number; motivo: string }
}

function OperativosForm({ handleClose, afterCreate }: FormProps) {
  const user = useSelector<IRootState, User>((x) => x.user.user)
  const handleRol = () => user.rol === Roles.ADMIN
  const methods = useForm<CamionesForm>({
    mode: 'all',
    defaultValues: { lpcarga: user.legajo },
  })
  const { control, reset, getValues, watch, setValue, setFocus } = methods
  const {
    selects: { vicente_lopez, barrios, turnos, resolucion, motivos },
    error,
  } = useSelects()
  const [activeStep, setActiveStep] = useState(0)

  const steps = () => {
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
    return [
      {
        label: 'Operativo',
        values: {
          fecha,
          legajo,
          direccion,
          zona,
          turno,
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

  const submitEvent = async (data: CamionesForm) => {
    const res = await nuevoOperativoCamiones(data)
    afterCreate(res)
    setFocus('dominio')
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
      },
      { keepDefaultValues: true }
    )
  }

  const esSancionable =
    getValues('resolucion') === 'ACTA' || getValues('resolucion') === 'REMITIDO'

  useEffect(() => {
    if (!esSancionable) {
      setValue('acta', null)
      setValue('motivo', null)
    }
  }, [esSancionable])

  return (
    <FormProvider {...methods}>
      <Layout
        error={error}
        steps={steps()}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        handleClose={handleClose}
        submitEvent={submitEvent}
        path="camiones"
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
              options={vicente_lopez}
              labelOption="barrio"
            />
          </Grid>
          <Grid item xs={8}>
            <FileNumberField control={control} name="legajo" label="Legajo" />
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
            <DomainField control={control} name="dominio" />
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
              options={barrios}
              labelOption="barrio"
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
              options={barrios}
              labelOption="barrio"
            />
          </Grid>
          <Grid item xs={8}>
            <CustomTextField
              control={control}
              name="licencia"
              label="Licencia"
            />
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
                labelOption="barrio"
              />
            </Grid>
          )}
        </Grid>
      </Layout>
    </FormProvider>
  )
}

export default OperativosForm
