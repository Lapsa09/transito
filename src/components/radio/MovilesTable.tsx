import React from 'react'
import { Datagrid, EditButton, List, TextField } from 'react-admin'

function MovilesTable() {
  return (
    <List empty={false} sx={styles.table}>
      <Datagrid bulkActionButtons={false}>
        <TextField source="movil" />
        <TextField source="estado" />
        <TextField source="novedades" />
        <EditButton />
      </Datagrid>
    </List>
  )
}

const styles = {
  table: {
    width: '80%',
    marginInline: 'auto',
  },
}

export default MovilesTable
