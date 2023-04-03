import React from 'react'
import {
  Datagrid,
  EditButton,
  FunctionField,
  List,
  TextField,
} from 'react-admin'

function OperariosTable() {
  return (
    <List empty={false} sx={styles.table}>
      <Datagrid bulkActionButtons={false}>
        <TextField source="legajo" />
        <TextField source="nombre" />
        <TextField source="estado" />
        <TextField source="movil" />
        <TextField source="ht" />
        <TextField source="puntaje" />
        <FunctionField
          render={(row) => (row.asistencia ? 'SI' : 'NO')}
          label="Asistencia"
        />
        <TextField source="qth" />
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

export default OperariosTable
