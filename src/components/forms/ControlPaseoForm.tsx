import React from 'react'
import { nuevoControlPaseo } from '../../services'
import { DatePicker, TimePicker, CustomTextField, CustomSelect } from '../ui'
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
  const methods = useForm<PaseoForm>({
    mode: 'all',
    defaultValues: {
      lpcarga: user.legajo,
      lp: !user.isAdmin() ? user.legajo : undefined,
    },
  })
  const { reset, getValues, watch, setFocus } = methods
  const { selects, error } = useSelects()

  const { fecha, turno, lp, motivo, hora, direccion, dominio, resolucion } =
    watch()

  const firstStep = {
    fecha,
    turno,
    lp,
    motivo,
  }

  const secondStep = {
    hora,
    direccion,
    dominio,
    resolucion,
  }

  const steps = [firstStep, secondStep]

  const submitting = async (data: PaseoForm) => {
    const res = await nuevoControlPaseo(data)
    setFocus('dominio')
    reset(
      { ...data, dominio: '', extranjero: false },
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
        steps={steps}
        handleClose={handleClose}
        submitEvent={submitting}
        error={error}
        path="paseo"
      >
        <Grid container spacing={2} columns={{ xs: 8, md: 16 }}>
          <Grid item xs={8}>
            <DatePicker
              label="Fecha"
              name="fecha"
              defaultValue={!user.isAdmin() ? currentDate() : ''}
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
              options={selects.turnos}
            />
          </Grid>
          <Grid item xs={8}>
            <CustomTextField.LEGAJO name="lp" label="Legajo Planilla" />
          </Grid>
          <Grid item xs={8}>
            <CustomSelect
              name="motivo"
              rules={{ required: 'Elija una opcion' }}
              label="Motivo"
              options={selects.motivos_paseo}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} columns={{ xs: 8, md: 16 }}>
          <Grid item xs={8}>
            <TimePicker
              name="hora"
              label="Hora"
              defaultValue={!user.isAdmin() ? currentDate() : undefined}
              disabled={!user.isAdmin()}
            />
          </Grid>
          <Grid item xs={8}>
            <CustomSelect
              name="direccion"
              rules={{ required: 'Elija una opcion' }}
              label="Direccion"
              options={selects.zonas_paseo}
              optionId="id_zona"
              optionLabel="zona"
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
              options={selects.resolucion}
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
        </Grid>
      </Layout>
    </FormProvider>
  )
}

export default ControlPaseoForm
