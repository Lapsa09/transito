import React from 'react'
import {
  Datagrid,
  FilterForm,
  ListContextProvider,
  NumberField,
  Pagination,
  SelectInput,
  TextField,
  TextInput,
  useListController,
} from 'react-admin'
import { ClientesServicios } from '../../components'

function Clientes() {
  const { data, page, perPage, isLoading, ...listContext } = useListController()

  if (isLoading) {
    return <div>Loading...</div>
  }

  const filters = [
    <TextInput label="Buscar por cliente" source="q" alwaysOn />,
    <SelectInput
      label="Buscar por mes"
      source="m"
      alwaysOn
      choices={[...new Set(data?.map((d) => d.mes))]
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) => t.place === value.place && t.name === value.name
            )
        )
        .sort((a, b) => a.id - b.id)}
    />,
    <SelectInput
      label="Buscar por año"
      source="y"
      alwaysOn
      choices={[...new Set(data?.map((d) => d.año))]
        .sort((a, b) => a - b)
        .map((año) => ({ id: año, name: año }))}
      translateChoice={false}
    />,
  ]
  return (
    <ListContextProvider
      value={{
        data: data?.slice((page - 1) * perPage, perPage * page),
        page,
        perPage,
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
          <h1>Clientes</h1>
          <FilterForm filters={filters} />
        </div>
        <Datagrid
          expandSingle
          isRowSelectable={() => false}
          expand={<ClientesServicios />}
        >
          <TextField textAlign="right" source="cliente" />
          <TextField textAlign="right" source="mes.name" label="Mes" />
          <NumberField source="año" />
          <NumberField
            source="a_deudor"
            label="A liquidar"
            locales="es-AR"
            options={{ style: 'currency', currency: 'ARS' }}
          />
          <NumberField
            source="a_favor"
            locales="es-AR"
            options={{ style: 'currency', currency: 'ARS' }}
          />
        </Datagrid>
        <Pagination />
      </div>
    </ListContextProvider>
  )
}

export default Clientes
