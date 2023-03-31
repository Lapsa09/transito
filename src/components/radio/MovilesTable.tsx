import React from 'react'
import { Datagrid, EditButton, List, TextField } from 'react-admin'

function MovilesTable() {
  return (
    <List empty={false} sx={{ width: '80%', marginInline: 'auto' }}>
      <Datagrid bulkActionButtons={false}>
        <TextField source="movil" />
        <TextField source="estado" />
        <TextField source="novedades" />
        <EditButton />
      </Datagrid>
    </List>
  )
}

export default MovilesTable
