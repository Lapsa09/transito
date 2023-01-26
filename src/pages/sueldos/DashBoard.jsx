import * as React from 'react'
import { CreateButton, EditButton } from 'react-admin'

export const Dashboard = () => {
  return (
    <div>
      <h1>This is the dashboard</h1>

      <CreateButton resource="clientes" label="Nuevo servicio" />
      <EditButton resource="precios" label="Editar precios" />
    </div>
  )
}
