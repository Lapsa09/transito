import React from 'react'
import { Datagrid, EditButton, List, TextField } from 'react-admin'

function OperariosTable() {
  return (
    <List empty={false} sx={{ width: '80%', marginInline: 'auto' }}>
      <Datagrid bulkActionButtons={false}>
        <TextField source="legajo" />
        <TextField source="nombre" />
        <TextField source="estado" />
        <TextField source="movil" />
        <TextField source="ht" />
        <TextField source="puntaje" />
        <TextField source="asistencia" />
        <TextField source="qth" />
        <TextField source="novedades" />
        <EditButton />
      </Datagrid>
    </List>
  )
}

export default OperariosTable
