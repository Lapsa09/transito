import React from 'react'
import {
  Datagrid,
  ExportButton,
  FilterForm,
  FunctionField,
  ListContextProvider,
  NumberField,
  Pagination,
  ReferenceInput,
  SelectInput,
  useListController,
  useTranslate,
} from 'react-admin'

function Liqui() {
  const listContext = useListController()

  const translate = useTranslate()

  const customExportFunction = (data) => {
    const res = data.servicios.filter((servicio) => !servicio.cancelado)
    listContext.exporter(
      res,
      null,
      null,
      `${translate(data.mes.name.trim())} ${data.año}`
    )
  }

  const filters = [
    <ReferenceInput
      label="Buscar por mes"
      source="m"
      reference="filters/months"
      alwaysOn
    >
      <SelectInput
        translateChoice={false}
        label="Buscar por mes"
        optionText={(row) => translate(row.name).trim()}
      />
    </ReferenceInput>,
    <ReferenceInput
      label="Buscar por año"
      source="y"
      reference="filters/years"
      alwaysOn
    >
      <SelectInput
        translateChoice={false}
        optionText="name"
        label="Buscar por año"
      />
    </ReferenceInput>,
  ]
  return (
    <ListContextProvider value={listContext}>
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
        <Datagrid isRowExpandable={() => false}>
          <FunctionField
            label="Mes"
            render={(record) => translate(record.mes.name)}
          />
          <NumberField source="año" />
          <FunctionField
            render={(row) => (
              <ExportButton exporter={() => customExportFunction(row)} />
            )}
          />
        </Datagrid>

        <Pagination />
      </div>
    </ListContextProvider>
  )
}

export default Liqui
