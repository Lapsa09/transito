import React, { useState } from 'react'
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
} from '@mui/material'
import { OperativosCreateForm, OperativosEditForm } from '../forms'
import { useData } from '../../hooks'
import { RadioOPForm } from '../../types'
import { getOperariosRadio } from '../../services'
import EditIcon from '@mui/icons-material/Edit'

function OperariosTable({ table }) {
  const {
    data: operarios,
    refreshPost: refreshOperariosPost,
    refreshPut: refreshOperariosPut,
  } = useData<RadioOPForm>(getOperariosRadio)

  const [id, setId] = useState(null)

  const handleCloseEdit = () => {
    setId(null)
  }

  const handleOpenEdit = (id) => {
    setId(id)
  }
  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <OperativosCreateForm refresh={refreshOperariosPost} />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Legajo</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Movil</TableCell>
            <TableCell>HT</TableCell>
            <TableCell>Puntaje</TableCell>
            <TableCell>Asistencia</TableCell>
            <TableCell>QTH</TableCell>
            <TableCell>Novedades</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {operarios.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.legajo}</TableCell>
              <TableCell>{row.nombre}</TableCell>
              <TableCell>{row.estado}</TableCell>
              <TableCell>{row.movil}</TableCell>
              <TableCell>{row.ht}</TableCell>
              <TableCell>{row.puntaje}</TableCell>
              <TableCell>{row.asistencia ? 'Si' : 'No'}</TableCell>
              <TableCell>{row.qth}</TableCell>
              <TableCell>{row.novedades}</TableCell>
              <TableCell>
                <EditIcon
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleOpenEdit(row.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {id && table === 'operarios' && (
        <OperativosEditForm
          id={id}
          handleClose={handleCloseEdit}
          refresh={refreshOperariosPut}
        />
      )}
    </Box>
  )
}

export default OperariosTable
