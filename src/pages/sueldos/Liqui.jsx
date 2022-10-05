import React from 'react'
import {
  BulkExportButton,
  Datagrid,
  DateField,
  FilterForm,
  FunctionField,
  ListContextProvider,
  NumberField,
  Pagination,
  SelectInput,
  TextField,
  useList,
  useListController,
  useRecordContext,
  useTranslate,
} from 'react-admin'
import { ServiciosMemo } from '../../components'
import { refresh } from '../../utils'

const customExportFunction = (data, selectedIds, exporter) => {
  const res = data.filter((row) => selectedIds.includes(row.id))
  exporter(res, '_', '_', 'servicios')
}

function Liqui() {
  const { data, ...listContext } = useListController()

  refresh.sueldos = listContext.refetch()

  const translate = useTranslate()

  const filters = [
    <SelectInput
      label="Buscar por mes"
      source="m"
      alwaysOn
      choices={[...new Set(data?.map((d) => d.mes))]
        .sort((a, b) => a.id - b.id)
        .map((fecha) => ({
          id: fecha.id,
          name: translate(fecha.name),
        }))
        .slice(0, 20)}
      translateChoice={false}
    />,
    <SelectInput
      label="Buscar por año"
      source="y"
      alwaysOn
      choices={[...new Set(data?.map((d) => d.año))]
        .sort((a, b) => a - b)
        .map((año) => ({
          id: año,
          name: año,
        }))
        .slice(0, 20)}
      translateChoice={false}
    />,
  ]
  return (
    <ListContextProvider
      value={{
        data,
        ...listContext,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            alignSelf: 'flex-end',
            width: '95%',
          }}
        >
          <h1>Liquidacion x Mes</h1>
          <FilterForm filters={filters} />
        </div>
        <Datagrid
          expandSingle
          expand={<LiquiServicios />}
          bulkActionButtons={
            <BulkExportButton
              exporter={(items) =>
                customExportFunction(
                  items,
                  listContext.selectedIds,
                  listContext.exporter
                )
              }
            />
          }
        >
          <FunctionField
            label="Mes"
            render={(record) => translate(record.mes.name)}
          />
          <NumberField source="año" />
        </Datagrid>
        <Pagination />
      </div>
    </ListContextProvider>
  )
}

function LiquiServicios() {
  const record = useRecordContext()
  const listContext = useList({ data: record.servicios })
  return (
    <ListContextProvider value={listContext}>
      <Datagrid
        expand={<ServiciosMemo />}
        rowStyle={(record) => ({
          backgroundColor: record.cancelado ? 'red' : 'white',
        })}
      >
        <DateField
          textAlign="right"
          source="fecha_servicio"
          label="Fecha del servicio"
        />
        <TextField textAlign="right" source="memo" label="Nº Memo" />
        <TextField textAlign="right" source="cliente" />
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
          options={{ style: 'currency', currency: 'ARS' }}
        />
        <NumberField
          source="importe_servicio"
          label="Importe del servicio"
          locales="es-AR"
          options={{ style: 'currency', currency: 'ARS' }}
        />
      </Datagrid>
    </ListContextProvider>
  )
}

export default Liqui
