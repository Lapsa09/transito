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
    const res = data.servicios
    if (listContext.exporter !== false)
      listContext.exporter(
        res,
        null,
        null,
        `${translate(data.mes.name)} ${data.año}`
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
        variant="standard"
        translateChoice={false}
        label="Buscar por mes"
        optionText={(row) => translate(row.name)}
      />
    </ReferenceInput>,
    <ReferenceInput
      label="Buscar por año"
      source="y"
      reference="filters/years"
      alwaysOn
    >
      <SelectInput
        variant="standard"
        translateChoice={false}
        optionText="name"
        label="Buscar por año"
      />
    </ReferenceInput>,
  ]
  return (
    <ListContextProvider value={listContext}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h1>Liquidacion x Mes</h1>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '95%',
          }}
        >
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
