import React from 'react'
import {
  Datagrid,
  FilterForm,
  ListContextProvider,
  NumberField,
  Pagination,
  TextField,
  TextInput,
  useListController,
} from 'react-admin'
import { ClientesMes } from '../../components'

function Clientes() {
  const listContext = useListController()

  const filters = [<TextInput label="Buscar por cliente" source="q" alwaysOn />]

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
          <h1>Clientes</h1>
          <FilterForm filters={filters} />
        </div>
        <Datagrid
          expandSingle
          isRowSelectable={() => false}
          expand={<ClientesMes />}
        >
          <TextField textAlign="right" source="cliente" />
          <NumberField
            source="a_deudor"
            label="A liquidar"
            locales="es-AR"
            options={{
              style: 'currency',
              currency: 'ARS',
              maximumFractionDigits: 0,
            }}
          />
          <NumberField
            source="a_favor"
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

export default Clientes
