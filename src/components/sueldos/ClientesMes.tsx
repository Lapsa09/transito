import React from 'react'
import {
  Datagrid,
  ListContextProvider,
  NumberField,
  TextField,
  useList,
  useRecordContext,
} from 'react-admin'
import { ClientesServicios } from '.'

function ClientesMes() {
  const record = useRecordContext()
  const listContext = useList({ data: record.historial })
  return (
    <ListContextProvider value={listContext}>
      <Datagrid isRowSelectable={() => false} expand={<ClientesServicios />}>
        <TextField label="Mes" source="mes.name" />
        <NumberField source="año" />
      </Datagrid>
    </ListContextProvider>
  )
}

export default ClientesMes
