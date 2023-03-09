import React, { useState } from 'react'
import { nuevoControlPaseo } from '../../services/controlDiarioService'
import {
  CustomDatePicker,
  CustomTimePicker,
  CustomTextField,
  CustomSelect,
  FileNumberField,
  DomainField,
} from '../ui'
import { useSelector } from 'react-redux'
import { FormProvider, useForm } from 'react-hook-form'
import { currentDate } from '../../utils'
import Layout from '../../layouts/FormLayout'
import { useSelects } from '../../hooks'
import { Grid } from '@mui/material'
import { IRootState } from '../../redux'
import { FormProps, User, FormInputProps } from '../../types'

interface PaseoForm extends FormInputProps {
  lp: number
  motivo: string
  lpcarga: number
}

function ControlPaseoForm({ handleClose, afterCreate }: FormProps) {
  const user = useSelector<IRootState, User>((x) => x.user.user)
  const handleRol = () => user?.rol === 'ADMIN'
  const methods = useForm<PaseoForm>({
    mode: 'all',
    defaultValues: {
      lpcarga: user?.legajo,
      lp: !handleRol() ? user?.legajo : null,
    },
  })
  const { control, reset, getValues, watch, setFocus } = methods
  const {
    selects: { motivos_paseo, turnos, resolucion, zonas_paseo },
    error,
  } = useSelects()
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      label: 'Operativo',
      values: {
        ...watch(['fecha', 'turno', 'lp', 'motivo']),
      },
    },
    {
      label: 'Vehiculo',
      values: {
        ...watch(['hora', 'direccion', 'dominio', 'resolucion']),
      },
    },
  ]

  const submitting = async (data: PaseoForm) => {
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
    <FormProvider {...methods}>
      <Layout
        steps={steps}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        handleClose={handleClose}
        submitEvent={submitting}
        error={error}
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
            <FileNumberField
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
              options={zonas_paseo}
            />
          </Grid>
          <Grid item xs={8}>
            <DomainField control={control} name="dominio" />
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
