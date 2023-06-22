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
import { IOperario } from '../../types'

export const ServiciosMemo = ({ name }) => {
  const record = useRecordContext()
  const listContext = useList({ data: record.operarios })
  const { refetch } = useListController({ resource: name })
  const [update] = useUpdate()

  const cancelarOperario = async (record: IOperario) => {
    await update(
      'operarios/cliente',
      {
        id: record.id_servicio,
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
          render={(record: IOperario) =>
            record.hora_inicio
              ? DateTime.fromFormat(
                  record.hora_inicio,
                  'HH:mm:ss'
                ).toLocaleString(DateTime.TIME_24_SIMPLE)
              : ''
          }
          label="Hora de inicio"
        />
        <FunctionField
          render={(record: IOperario) =>
            !!record.hora_fin
              ? DateTime.fromFormat(record.hora_fin, 'HH:mm:ss').toLocaleString(
                  DateTime.TIME_24_SIMPLE
                )
              : ''
          }
          label="Hora final"
        />
        <FunctionField
          render={(record: IOperario) => (
            <Button onClick={() => cancelarOperario(record)} label="Cancelar" />
          )}
        />
      </Datagrid>
    </ListContextProvider>
  )
}
