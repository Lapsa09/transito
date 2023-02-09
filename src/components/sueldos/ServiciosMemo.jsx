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
  useListController,
} from 'react-admin'

export const ServiciosMemo = ({ name }) => {
  const record = useRecordContext()
  const listContext = useList({ data: record.operarios })
  const { refetch } = useListController({ resource: name })
  const [update] = useUpdate()

  const cancelarOperario = (record) => {
    update(
      'operarios/cliente',
      {
        id: record.id,
        data: { cancelado: !record.cancelado, legajo: record.legajo },
      },
      {
        onSuccess: () => {
          refetch()
        },
      }
    )
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
            !!record.hora_inicio
              ? DateTime.fromFormat(
                  record.hora_inicio,
                  'hh:mm:ss'
                ).toLocaleString(DateTime.TIME_24_SIMPLE)
              : ''
          }
          label="Hora de inicio"
        />
        <FunctionField
          render={(record) =>
            !!record.hora_fin
              ? DateTime.fromFormat(record.hora_fin, 'hh:mm:ss').toLocaleString(
                  DateTime.TIME_24_SIMPLE
                )
              : ''
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
