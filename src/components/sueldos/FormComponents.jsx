import { Grid, InputAdornment, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { SelectInput, useGetList, useInput } from 'react-admin'
import { CreateRecibo } from './QuickCreate'
import { DatePickerComponent } from './TimePicker'
import styles from '../../styles/Sueldos.module.css'
import { Observable } from '../../utils'

const getImporteOperario = (dia, inicio, fin, isFeriado, importe) => {
  if ([dia, inicio, fin, isFeriado].some((e) => e == null)) {
    return importe
  }

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

export const Recibo = ({ formData }) => {
  const [options, setOptions] = useState([])
  const { data, isLoading } = useGetList(
    'recibos/' + (formData.id_cliente || 'none')
  )
  const { field: importe } = useInput({
    source: 'importe_recibo',
    defaultValue: '',
  })

  const elegido = options?.find((d) => d.recibo === formData.recibo)

  const observer = new Observable()

  useEffect(() => {
    setOptions(data)
    // eslint-disable-next-line
  }, [formData.id_cliente, isLoading])

  useEffect(() => {
    observer.notify(elegido?.fecha_recibo)
    importe.onChange(elegido?.importe_recibo)
    // eslint-disable-next-line
  }, [formData.recibo])

  return (
    <Grid container item spacing={2} columns={{ xs: 8, md: 16 }}>
      <Grid item xs={8}>
        <SelectInput
          label="Nº Recibo"
          source="recibo"
          optionValue="recibo"
          optionText="recibo"
          emptyText="Elija una opcion"
          choices={options}
          translateChoice={false}
          className={styles.inputs}
          isRequired
        />
        {formData.id_cliente && <CreateRecibo setData={setOptions} />}
      </Grid>
      <Grid item xs={8}>
        <DatePickerComponent
          source="fecha_recibo"
          className={styles.inputs}
          label="Fecha del recibo"
          observer={observer}
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
