import React, { useState } from 'react'
import { nuevoControlPaseo } from '../../services'
import { DatePicker, TimePicker, CustomTextField, CustomSelect } from '../ui'
import { useSelector } from 'react-redux'
import { FormProvider, useForm } from 'react-hook-form'
import { currentDate } from '../../utils'
import Layout from '../../layouts/FormLayout'
import { useSelects } from '../../hooks'
import { Grid } from '@mui/material'
import { IRootState } from '../../redux'
import { FormProps, User, FormInputProps, Roles } from '../../types'

interface PaseoForm extends FormInputProps {
  lp: number
  motivo: string
  lpcarga: number
}

function ControlPaseoForm({ handleClose, afterCreate }: FormProps) {
  const user = useSelector<IRootState, User>((x) => x.user.user)
  const methods = useForm<PaseoForm>({
    mode: 'all',
    defaultValues: {
      lpcarga: user.legajo,
      lp: !user.isAdmin() ? user.legajo : null,
    },
  })
  const { control, reset, getValues, watch, setFocus } = methods
  const {
    selects: { motivos_paseo, turnos, resolucion, zonas_paseo },
    error,
  } = useSelects()
  const [activeStep, setActiveStep] = useState(0)

  const steps = () => {
    const { fecha, turno, lp, motivo, hora, direccion, dominio, resolucion } =
      watch()
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
          direccion,
          dominio,
          resolucion,
        },
      },
    ]
  }

  const submitting = async (data: PaseoForm) => {
    const res = await nuevoControlPaseo(data)
    setFocus('dominio')
    reset({ ...data, dominio: '' }, { keepDefaultValues: true })
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
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        handleClose={handleClose}
        submitEvent={submitting}
        error={error}
        path="paseo"
      >
        <Grid container spacing={2} columns={{ xs: 8, md: 16 }}>
          <Grid item xs={8}>
            <DatePicker
              control={control}
              label="Fecha"
              name="fecha"
              defaultValue={!user.isAdmin() ? currentDate : ''}
              disabled={!user.isAdmin()}
            />
          </Grid>
          <Grid item xs={8}>
            <CustomSelect
              control={control}
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
              control={control}
              name="lp"
              label="Legajo Planilla"
            />
          </Grid>
          <Grid item xs={8}>
            <CustomSelect
              control={control}
              name="motivo"
              rules={{ required: 'Elija una opcion' }}
              label="Motivo"
              options={motivos_paseo}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} columns={{ xs: 8, md: 16 }}>
          <Grid item xs={8}>
            <TimePicker
              control={control}
              name="hora"
              label="Hora"
              defaultValue={!user.isAdmin() ? currentDate : null}
              disabled={!user.isAdmin()}
            />
          </Grid>
          <Grid item xs={8}>
            <CustomSelect
              control={control}
              name="direccion"
              rules={{ required: 'Elija una opcion' }}
              label="Direccion"
              options={zonas_paseo}
              optionId="id_zona"
              optionLabel="zona"
            />
          </Grid>
          <Grid item xs={8}>
            <CustomTextField.DOMINIO control={control} name="dominio" />
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
    </FormProvider>
  )
}

export default ControlPaseoForm
