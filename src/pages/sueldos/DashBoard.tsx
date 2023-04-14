import * as React from 'react'
import { CreateButton } from 'react-admin'

const Dashboard = () => {
  return (
    <div>
      <h1>This is the dashboard</h1>

      <CreateButton size="medium" resource="servicios" label="Nuevo servicio" />
    </div>
  )
}
export default Dashboard
