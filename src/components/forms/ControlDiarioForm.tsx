import React from 'react'
import { nuevoControl } from '../../services'
import { useSelector } from 'react-redux'
import { FormProvider, useForm } from 'react-hook-form'
import {
  DatePicker,
  TimePicker,
  CustomTextField,
  CustomSelect,
  CustomAutocomplete,
} from '../ui'
import { currentDate } from '../../utils'
import Layout from '../../layouts/FormLayout'
import { useSelects } from '../../hooks'
import { Grid } from '@mui/material'
import { IRootState } from '../../redux'
import { FormProps, User, FormInputProps, Roles, IMotivos } from '../../types'

interface DiarioForm extends FormInputProps {
  lp: number
  localidad: string
  motivo: IMotivos
  otroMotivo?: string
}

function ControlDiarioForm({ handleClose, afterCreate }: FormProps) {
  const user = useSelector<IRootState, User>((x) => x.user.user)
  const methods = useForm<DiarioForm>({
    mode: 'all',
    defaultValues: {
      lpcarga: user.legajo,
      lp: !user.isAdmin() ? user.legajo : null,
    },
  })
  const { reset, getValues, watch } = methods
  const {
    selects: { barrios, motivos, turnos, resolucion },
    error,
  } = useSelects()

  const steps = () => {
    const {
      fecha,
      turno,
      lp,
      hora,
      direccion,
      dominio,
      resolucion,
      motivo,
      localidad,
      acta,
      otroMotivo,
    } = watch()
    return [
      {
        label: 'Operativo',
        values: {
          fecha,
          turno,
          lp,
        },
      },
      {
        label: 'Vehiculo',
        values: {
          hora,
          direccion,
          dominio,
          resolucion,
          motivo,
          localidad,
          acta,
          otroMotivo,
        },
      },
    ]
  }

  const submitting = async (data: DiarioForm) => {
    const res = await nuevoControl(data)
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
        acta: undefined,
      },
      { keepDefaultValues: true }
    )
    if (user.isAdmin()) {
      afterCreate(res)
    } else {
      setTimeout(handleClose, 2000)
    }
  }

  return (
    <FormProvider {...methods}>
      <Layout
        steps={steps()}
        handleClose={handleClose}
        submitEvent={submitting}
        error={error}
        path="diario"
      >
        <Grid container spacing={2} columns={{ xs: 8, md: 16 }}>
          <Grid item xs={8}>
            <DatePicker
              label="Fecha"
              name="fecha"
              defaultValue={!user.isAdmin() ? currentDate() : null}
              disabled={!user.isAdmin()}
            />
          </Grid>
          <Grid item xs={8}>
            <CustomSelect
              name="turno"
              rules={{ required: 'Elija una opcion' }}
              label="Turno"
              defaultValue={!user.isAdmin() ? user.turno : ''}
              disabled={!user.isAdmin()}
              options={turnos}
            />
          </Grid>
          <Grid item xs={8}>
            <CustomTextField.LEGAJO
              name="legajo_planilla"
              label="Legajo Planilla"
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} columns={{ xs: 8, md: 16 }}>
          <Grid item xs={8}>
            <TimePicker
              name="hora"
              label="Hora"
              defaultValue={!user.isAdmin() ? currentDate() : null}
              disabled={!user.isAdmin()}
            />
          </Grid>
          <Grid item xs={8}>
            <CustomTextField
              name="direccion"
              rules={{ required: 'Ingrese una direccion valida' }}
              label="Direccion"
            />
          </Grid>
          <Grid item xs={8}>
            <CustomAutocomplete
              name="localidad"
              rules={{ required: 'Elija una opcion' }}
              label="Localidad"
              options={barrios}
              labelOption="barrio"
            />
          </Grid>
          <Grid item xs={8}>
            <CustomTextField.DOMINIO name="dominio" />
          </Grid>
          <Grid item xs={8}>
            <CustomSelect
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
              name="motivo"
              rules={{ required: 'Elija una opcion' }}
              label="Motivo"
              options={motivos}
              optionId="id_motivo"
              optionLabel="motivo"
            />
          </Grid>
          {motivos?.length > 0 && getValues('motivo').motivo === 'OTRO' && (
            <Grid item xs={8}>
              <CustomTextField
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
