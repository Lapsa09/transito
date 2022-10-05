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
  useTranslate,
  FunctionField,
  useGetList,
} from 'react-admin'
import { ClientesServicios } from '../../components'
import { refresh } from '../../utils'

function Clientes() {
  const { data, ...listContext } = useListController()
  const { data: meses } = useGetList('filters/months')
  const { data: años } = useGetList('filters/years')

  const translate = useTranslate()

  refresh.sueldos = listContext.refetch()

  const filters = [
    <TextInput label="Buscar por cliente" source="q" alwaysOn />,
    <SelectInput
      label="Buscar por mes"
      source="m"
      translateChoice={false}
      alwaysOn
      choices={
        meses?.map((mes) => ({ ...mes, name: translate(mes.name) })) || []
      }
    />,
    <SelectInput
      label="Buscar por año"
      source="y"
      alwaysOn
      translateChoice={false}
      choices={años || []}
    />,
  ]

  return (
    <ListContextProvider value={{ data, ...listContext }}>
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
          <FunctionField
            label="Mes"
            render={(record) => translate(record.mes.name)}
          />
          <NumberField source="año" />
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
