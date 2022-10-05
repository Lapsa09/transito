import { DateTime } from 'luxon'
import React from 'react'
import {
  Datagrid,
  TextField,
  useRecordContext,
  ListContextProvider,
  useList,
  NumberField,
  Button,
  FunctionField,
  useUpdate,
} from 'react-admin'
import { refresh } from '../../utils'

export const ServiciosMemo = () => {
  const record = useRecordContext()
  const listContext = useList({ data: record.operarios })
  const [update] = useUpdate()

  const cancelarOperario = (record) => {
    update('operario/cliente', {
      id: record.id_servicio,
      data: { cancelado: !record.cancelado, legajo: record.legajo },
    })
    refresh.sueldos()
  }
  return (
    <ListContextProvider value={listContext}>
      <Datagrid
        isRowSelectable={() => false}
        rowStyle={(record) => ({
          backgroundColor: record.cancelado ? 'red' : 'white',
        })}
      >
        <TextField textAlign="right" source="legajo" label="Nº Legajo" />
        <TextField textAlign="right" source="nombre" label="Nombre" />
        <NumberField
          source="a_cobrar"
          label="A Cobrar"
          locales="es-AR"
          options={{
            style: 'currency',
            currency: 'ARS',
            maximumFractionDigits: 0,
          }}
        />
        <FunctionField
          render={(record) =>
            DateTime.fromFormat(record.hora_inicio, 'hh:mm:ss').toLocaleString(
              DateTime.TIME_24_SIMPLE
            )
          }
          label="Hora de inicio"
        />
        <FunctionField
          render={(record) =>
            DateTime.fromFormat(record.hora_fin, 'hh:mm:ss').toLocaleString(
              DateTime.TIME_24_SIMPLE
            )
          }
          label="Hora final"
        />
        <FunctionField
          render={(record) => (
            <Button onClick={() => cancelarOperario(record)} label="Cancelar" />
          )}
        />
      </Datagrid>
    </ListContextProvider>
  )
}
