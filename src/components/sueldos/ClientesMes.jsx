import React from 'react'
import {
  Datagrid,
  FunctionField,
  ListContextProvider,
  NumberField,
  useList,
  useRecordContext,
  useTranslate,
} from 'react-admin'
import { ClientesServicios } from '.'

function ClientesMes() {
  const record = useRecordContext()
  const listContext = useList({ data: record.historial })
  const translate = useTranslate()
  return (
    <ListContextProvider value={listContext}>
      <Datagrid isRowSelectable={() => false} expand={<ClientesServicios />}>
        <FunctionField
          label="Mes"
          render={(record) => translate(record.mes.name)}
        />
        <NumberField source="año" />
      </Datagrid>
    </ListContextProvider>
  )
}

export default ClientesMes
