import { Grid, InputAdornment, TextField } from '@mui/material'
import { useEffect } from 'react'
import { NumberInput, useGetOne, useInput } from 'react-admin'
import { DatePickerComponent } from './TimePicker'
import styles from '../../styles/Sueldos.module.css'
import { DateTime } from 'luxon'
import { useWatch } from 'react-hook-form'

const getImporteOperario = (
  _dia,
  _inicio,
  _fin,
  isFeriado,
  importe,
  precios
) => {
  if (
    ![_dia, _inicio, _fin, isFeriado].every((e) => e != null) ||
    _inicio.invalid != null ||
    _inicio._fin != null ||
    !precios
  ) {
    return importe
  }

  const { precio_normal, precio_pico } = precios
  const dia = DateTime.fromISO(_dia)
  const inicio = DateTime.fromISO(_inicio)
  const fin = DateTime.fromISO(_fin)

  const diff = fin?.diff(inicio, 'hours').hours
  if (dia.weekday >= 1 && dia.weekday <= 5 && !isFeriado) {
    if (inicio?.hour >= 8 && fin?.hour <= 20) {
      return precio_normal * parseInt(diff)
    }
  }
  return precio_pico * parseInt(diff)
}

export const OpInput = ({ source }) => {
  const index = source.split('.')[1]
  const { fecha_servicio, feriado } = useWatch()
  const operario = useWatch({ name: 'operarios.' + index })
  const { data: precios } = useGetOne('precios', { id: 0 })

  const { field } = useInput({
    source,
    defaultValue: operario.a_cobrar,
  })

  useEffect(() => {
    const cuenta = getImporteOperario(
      fecha_servicio,
      operario.hora_inicio,
      operario.hora_fin,
      feriado,
      field.value,
      precios
    )
    field.onChange(cuenta)

    // eslint-disable-next-line
  }, [operario.hora_inicio, operario.hora_fin, fecha_servicio, feriado])

  return (
    <TextField
      {...field}
      className={styles.inputs}
      type="number"
      variant="standard"
      label="A cobrar"
      disabled
      InputProps={{
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
      }}
    />
  )
}

export const TotalInput = () => {
  const ops = useWatch({ name: 'operarios' })
  const { field } = useInput({
    source: 'importe_servicio',
    defaultValue: ops.importe_servicio,
  })
  const cuenta = ops?.reduce((a, b) => a + b?.a_cobrar, 0)

  useEffect(() => {
    field.onChange(cuenta)
    // eslint-disable-next-line
  }, [cuenta])

  return (
    <TextField
      {...field}
      className="inputs total"
      type="number"
      variant="standard"
      label="Importe del servicio"
      disabled
      InputProps={{
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
      }}
    />
  )
}

export const Acopio = () => {
  const { field: importe } = useInput({
    source: 'acopio',
    defaultValue: 0,
  })

  const id_cliente = useWatch({ name: 'id_cliente' })

  const { data } = useGetOne('acopio', { id: id_cliente })

  useEffect(() => {
    importe.onChange(data?.acopio)
  }, [id_cliente])

  return (
    <Grid item xs={8}>
      <TextField
        type="number"
        {...importe}
        label="Acopio"
        variant="standard"
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
  return (
    <Grid container item spacing={2} columns={{ xs: 8, md: 16 }}>
      <Grid item xs={8}>
        <NumberInput
          source="recibo"
          label="Recibo"
          className={styles.inputs}
          required
          variant="standard"
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
        <NumberInput
          source="importe_recibo"
          variant="standard"
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
