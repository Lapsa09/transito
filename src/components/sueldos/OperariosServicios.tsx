import React from 'react'
import {
  Datagrid,
  useRecordContext,
  ListContextProvider,
  useList,
  NumberField,
  DateField,
  FunctionField,
} from 'react-admin'
import { IServicio } from '../../types/Sueldos'
import { CreateMemo } from '.'

export const OperariosServicios = () => {
  const record = useRecordContext()
  const listContext = useList({ data: record.servicios })
  return (
    <ListContextProvider value={listContext}>
      <Datagrid isRowSelectable={() => false}>
        <FunctionField
          textAlign="right"
          label="Nº Memo"
          render={(record: IServicio) =>
            record.memo || <CreateMemo id={record.id} resource="operarios" />
          }
        />
        <NumberField source="recibo" label="Nº Recibo" />
        <DateField
          textAlign="right"
          source="fecha_recibo"
          label="Fecha del recibo"
        />
        <DateField
          textAlign="right"
          source="fecha_servicio"
          label="Fecha del servicio"
        />
        <NumberField
          source="a_cobrar"
          label="Importe"
          locales="es-AR"
          options={{ style: 'currency', currency: 'ARS' }}
        />
      </Datagrid>
    </ListContextProvider>
  )
}
