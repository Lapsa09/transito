import React from 'react'
import { useDataProvider, useNotify, useRedirect, useUpdate } from 'react-admin'
import { CustomTextField } from '../../components'
import { useForm } from 'react-hook-form'
import { Button } from '@mui/material'

function EditPrecio() {
  const router = useRedirect()

  return (
    <div>
      <PrecioField name="precio_normal" label="Precio Normal" />
      <PrecioField name="precio_pico" label="Precio Pico" />
      <Button
        size="medium"
        variant="contained"
        sx={style.toolbarButton}
        onClick={() => router('/sueldos')}
      >
        Volver
      </Button>
    </div>
  )
}

function PrecioField({ name, label }) {
  const provider = useDataProvider()
  const { control, handleSubmit } = useForm({
    defaultValues: async () => {
      const { data } = await provider.getOne('precios', { id: name })
      return data
    },
  })
  const [update] = useUpdate()
  const notify = useNotify()

  const onSubmit = async (data) => {
    await update(
      'precios',
      { id: name, data },
      { onSuccess: () => notify(`${label} actualizado`) }
    )
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} style={style.inputRow}>
      <CustomTextField
        type="number"
        control={control}
        name="precio"
        label={label}
        rules={{ required: true }}
      />
      <Button variant="contained" color="success" type="submit">
        Guardar
      </Button>
    </form>
  )
}

const style = {
  toolbar: {
    gap: '10px',
  },
  toolbarButton: {
    backgroundColor: 'red',
  },
  inputRow: {
    display: 'flex',
    maxWidth: '300px',
    gap: '10px',
    marginTop: '10px',
  },
}

export default EditPrecio
