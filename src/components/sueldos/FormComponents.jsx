import { Grid, InputAdornment, TextField } from '@mui/material'
import { useEffect } from 'react'
import { useGetOne, useInput } from 'react-admin'
import { DatePickerComponent } from './TimePicker'
import styles from '../../styles/Sueldos.module.css'
import { DateTime } from 'luxon'

const getImporteOperario = (_dia, _inicio, _fin, isFeriado, importe) => {
  if ([_dia, _inicio, _fin, isFeriado].some((e) => e == null)) {
    return importe
  }

  const dia = DateTime.fromISO(_dia)
  const inicio = DateTime.fromISO(_inicio)
  const fin = DateTime.fromISO(_fin)

  const diff = fin.diff(inicio, 'hours').hours
  if (dia.weekday >= 1 && dia.weekday <= 5 && !isFeriado) {
    if (inicio.hour >= 8 && fin.hour <= 20) {
      return 644 * parseInt(diff)
    }
  }
  return 1036 * parseInt(diff)
}

export const OpInput = ({ source, formData, scopedFormData }) => {
  const { fecha_servicio, feriado } = formData
  const { hora_inicio, hora_fin } = scopedFormData

  const { field } = useInput({
    source,
    defaultValue: 0,
  })

  const cuenta = getImporteOperario(
    fecha_servicio,
    hora_inicio,
    hora_fin,
    feriado,
    field.value
  )

  useEffect(() => {
    field.onChange(cuenta)
    // eslint-disable-next-line
  }, [cuenta])

  return (
    <TextField
      {...field}
      className={styles.inputs}
      type="number"
      label="A cobrar"
      disabled
      InputProps={{
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
      }}
    />
  )
}

export const TotalInput = ({ ops }) => {
  const { field } = useInput({
    source: 'importe_servicio',
    defaultValue: 0,
  })
  const cuenta = !!ops ? ops.reduce((a, b) => a + b?.a_cobrar, 0) : 0

  useEffect(() => {
    field.onChange(cuenta)
    // eslint-disable-next-line
  }, [cuenta])

  return (
    <TextField
      {...field}
      className="inputs total"
      type="number"
      label="Importe del servicio"
      disabled
      InputProps={{
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
      }}
    />
  )
}

export const Acopio = ({ formData }) => {
  const { field: importe } = useInput({
    source: 'acopio',
    defaultValue: 0,
  })

  const { data } = useGetOne('acopio', { id: formData.id_cliente })

  useEffect(() => {
    importe.onChange(data?.acopio)
  }, [formData.id_cliente, formData.medio_pago])

  return (
    <Grid item xs={8}>
      <TextField
        type="number"
        {...importe}
        label="Acopio"
        className={styles.inputs}
        required
        disabled
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
      />
    </Grid>
  )
}

export const Recibo = () => {
  const { field: importe } = useInput({
    source: 'importe_recibo',
    defaultValue: '',
  })

  const { field: recibo } = useInput({ source: 'recibo', defaultValue: '' })

  return (
    <Grid container item spacing={2} columns={{ xs: 8, md: 16 }}>
      <Grid item xs={8}>
        <TextField
          type="number"
          {...recibo}
          label="Recibo"
          className={styles.inputs}
          required
        />
      </Grid>
      <Grid item xs={8}>
        <DatePickerComponent
          source="fecha_recibo"
          className={styles.inputs}
          label="Fecha del recibo"
        />
      </Grid>
      <Grid item xs={8}>
        <TextField
          type="number"
          {...importe}
          label="Importe del recibo"
          className={styles.inputs}
          required
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
      </Grid>
    </Grid>
  )
}
