import { EditRounded } from '@mui/icons-material'
import * as React from 'react'
import { CreateButton, useRedirect, Button } from 'react-admin'

export const Dashboard = () => {
  const router = useRedirect()
  return (
    <div>
      <h1>This is the dashboard</h1>

      <CreateButton size="medium" resource="clientes" label="Nuevo servicio" />
      <Button
        onClick={() => router('/sueldos/precios/0')}
        startIcon={<EditRounded />}
        label="Editar precios"
      />
    </div>
  )
}
