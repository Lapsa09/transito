import React from 'react'
import {
  Datagrid,
  DateField,
  EditButton,
  FunctionField,
  ListContextProvider,
  NumberField,
  useList,
  useRecordContext,
} from 'react-admin'
import { CreateMemo, ServiciosMemo } from '.'

function ClientesServicios() {
  const record = useRecordContext()
  const listContext = useList({ data: record.servicios })
  return (
    <ListContextProvider value={listContext}>
      <Datagrid
        isRowExpandable={(row) => row.operarios?.length > 0}
        isRowSelectable={() => false}
        rowStyle={(record) => ({
          backgroundColor: record.cancelado ? 'red' : 'white',
        })}
        expand={<ServiciosMemo name="clientes" />}
      >
        <FunctionField
          textAlign="right"
          label="Nº Memo"
          render={(record) =>
            record.memo || <CreateMemo id={record.id} resource="clientes" />
          }
        />
        <NumberField source="recibo" label="Nº Recibo" />
        <DateField
          textAlign="right"
          source="fecha_recibo"
          label="Fecha del recibo"
        />
        <NumberField
          source="importe_recibo"
          label="Importe del recibo"
          locales="es-AR"
          options={{
            style: 'currency',
            currency: 'ARS',
            maximumFractionDigits: 0,
          }}
        />
        <DateField
          textAlign="right"
          source="fecha_servicio"
          label="Fecha del servicio"
        />
        <NumberField
          source="importe_servicio"
          label="Importe del servicio"
          locales="es-AR"
          options={{
            style: 'currency',
            currency: 'ARS',
            maximumFractionDigits: 0,
          }}
        />
        <EditButton resource="servicios" />
      </Datagrid>
    </ListContextProvider>
  )
}

export default ClientesServicios
