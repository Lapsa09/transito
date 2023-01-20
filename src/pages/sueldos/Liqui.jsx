import React from 'react'
import {
  BulkExportButton,
  Datagrid,
  FilterForm,
  FunctionField,
  ListContextProvider,
  NumberField,
  Pagination,
  SelectInput,
  useListController,
  useTranslate,
} from 'react-admin'
import { refresh } from '../../utils'

const customExportFunction = (data, selectedIds, exporter) => {
  const res = data.find((row) => selectedIds.includes(row.id)).servicios
  exporter(res, null, null, 'servicios')
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

export default Liqui
