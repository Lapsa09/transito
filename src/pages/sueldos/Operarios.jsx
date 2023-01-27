import React from 'react'
import {
  Datagrid,
  TextField,
  NumberField,
  useListController,
  ListContextProvider,
  Pagination,
  FilterForm,
  SelectInput,
  TextInput,
  FunctionField,
  useTranslate,
  ReferenceInput,
} from 'react-admin'
import { OperariosServicios } from '../../components'

export const Operarios = () => {
  const listContext = useListController()
  const translate = useTranslate()

  const filters = [
    <TextInput
      variant="standard"
      label="Buscar operario por legajo o nombre"
      source="q"
      alwaysOn
    />,
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
        <h1>Operarios</h1>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '95%',
          }}
        >
          <FilterForm filters={filters} />
        </div>
        <Datagrid
          expandSingle
          isRowSelectable={() => false}
          expand={<OperariosServicios />}
        >
          <TextField textAlign="right" source="legajo" />
          <TextField textAlign="right" source="inspector" />
          <FunctionField
            textAlign="right"
            label="Mes"
            render={(record) => translate(record.mes.name)}
          />
          <TextField textAlign="right" source="año" />
          <NumberField
            source="total"
            locales="es-AR"
            options={{
              style: 'currency',
              currency: 'ARS',
              maximumFractionDigits: 0,
            }}
          />
        </Datagrid>
        <Pagination />
      </div>
    </ListContextProvider>
  )
}
