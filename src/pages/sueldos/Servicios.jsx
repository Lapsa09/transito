import { Chip } from '@mui/material'
import { DateTime } from 'luxon'
import React from 'react'
import {
  Button,
  Datagrid,
  DateField,
  DateInput,
  EditButton,
  ExportButton,
  FilterButton,
  FilterForm,
  FunctionField,
  ListContextProvider,
  Pagination,
  ReferenceInput,
  SelectInput,
  TextField,
  TextInput,
  useListController,
  useTranslate,
} from 'react-admin'
import { CreateMemo, ServiciosMemo } from '../../components'

function Servicios() {
  const translate = useTranslate()

  const listContext = useListController({
    filterDefaultValues: { d: DateTime.now().toFormat('yyyy-MM-dd') },
  })

  const filters = [
    <DateInput label="Buscar por dia" source="d" alwaysOn />,
    <ReferenceInput
      label="Buscar por mes"
      source="m"
      reference="filters/months"
    >
      <SelectInput
        translateChoice={false}
        label="Buscar por mes"
        optionText={(row) => translate(row.name).trim()}
      />
    </ReferenceInput>,
    <ReferenceInput label="Buscar por año" source="y" reference="filters/years">
      <SelectInput
        translateChoice={false}
        optionText="name"
        label="Buscar por año"
      />
    </ReferenceInput>,
    <TextInput source="q" label="Buscar por nombre o memo" />,
    <Chip
      source="no_memo"
      label="Buscar los sin memos"
      defaultValue={true}
      sx={{ marginBottom: 1.5 }}
    />,
  ]

  const customExport = (data) => {
    const res = data.map((row) => row.operarios).filter((row) => !row.cancelado)

    listContext.exporter(res, null, null, 'servicios del dia')
  }

  return (
    <ListContextProvider value={listContext}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '95%',
          }}
        >
          <h1>Todos los Servicios</h1>
          <Button
            label="Borrar Filtros"
            onClick={() => listContext.setFilters({})}
          />
          <FilterForm filters={filters} />
          <FilterButton filters={filters} />
          <ExportButton exporter={customExport} />
        </div>
        <Datagrid
          expandSingle
          isRowSelectable={() => false}
          isRowExpandable={(row) => row.operarios.length === 0}
          expand={<ServiciosMemo name="servicios" />}
          rowStyle={(record) => ({
            backgroundColor: record.cancelado ? 'red' : 'white',
          })}
        >
          <TextField textAlign="right" source="cliente" />
          <DateField
            textAlign="right"
            source="fecha_servicio"
            label="Fecha del servicio"
          />
          <FunctionField
            source="memo"
            textAlign="right"
            label="Nº Memo"
            render={(record) =>
              record.memo || <CreateMemo id={record.id} resource="servicios" />
            }
          />
          <EditButton />
        </Datagrid>
        <Pagination />
      </div>
    </ListContextProvider>
  )
}

export default Servicios
