import React, { useState } from 'react'
import { FormLayout } from '../../layouts'
import { Grid } from '@mui/material'
import { useSelector } from 'react-redux'
import { IRootState } from '../../redux'
import { FormProps, User } from '../../types'
import { useForm } from 'react-hook-form'
import {
  CustomAutocomplete,
  CustomSelect,
  CustomTextField,
  DatePicker,
} from '../ui'
import { useSelects } from '../../hooks'

interface LogisticaProps {
  fecha: string
  area: number
  no_orden: number
  tipo_repuesto: number
  cantidad: number
  stock: number
  taller: number
}

function LogisticaForm({ handleClose, afterCreate }: FormProps) {
  const user = useSelector<IRootState, User>((x) => x.user.user)
  const methods = useForm<LogisticaProps>({
    mode: 'all',
  })
  const { control, reset, watch } = methods
  const [activeStep, setActiveStep] = useState(0)
  const { error } = useSelects()

  const submitEvent = async (data: LogisticaProps) => {
    // const res = await nuevoOperativoAuto(data)
    // afterCreate(res)
    // setFocus('dominio')
    console.log(data)
    reset({}, { keepDefaultValues: true })
  }

  const steps = () => {
    const { fecha, area, no_orden, cantidad, stock, taller, tipo_repuesto } =
      watch()
    return [
      {
        label: 'Compra',
        values: {
          fecha,
          area,
          no_orden,
        },
      },
      {
        label: 'Repuesto',
        values: {
          tipo_repuesto,
          cantidad,
          stock,
          taller,
        },
      },
    ]
  }

  return (
    <FormLayout
      handleClose={handleClose}
      path="Logistica"
      activeStep={activeStep}
      setActiveStep={setActiveStep}
      submitEvent={submitEvent}
      steps={steps()}
      error={error}
    >
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <DatePicker control={control} name="fecha" label="Fecha" />
        </Grid>
        <Grid item xs={8}>
          <CustomTextField
            control={control}
            name="no_orden"
            label="Numero de orden"
            type="number"
          />
        </Grid>
        <Grid item xs={8}>
          <CustomSelect
            options={[]}
            control={control}
            name="area"
            label="Area"
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <CustomAutocomplete
            control={control}
            name="tipo_repuesto"
            label="Tipo de repuesto"
            options={[]}
          />
        </Grid>
        <Grid item xs={8}>
          <CustomTextField
            control={control}
            name="cantidad"
            label="Cantidad"
            type="number"
          />
        </Grid>
        <Grid item xs={8}>
          <CustomTextField
            control={control}
            name="stock"
            label="Stock"
            type="number"
          />
        </Grid>
        <Grid item xs={8}>
          <CustomSelect
            options={[]}
            control={control}
            name="taller"
            label="Taller"
          />
        </Grid>
      </Grid>
    </FormLayout>
  )
}

export default LogisticaForm
