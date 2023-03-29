import React, { useState } from 'react'
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
} from '@mui/material'
import { MovilCreateForm, MovilEditForm } from '../forms'
import { useData } from '../../hooks'
import { RadioMovilForm } from '../../types'
import { getMovilesRadio } from '../../services'
import EditIcon from '@mui/icons-material/Edit'

function MovilesTable({ table }) {
  const {
    data: moviles,
    refreshPost: refreshMovilesPost,
    refreshPut: refreshMovilesPut,
  } = useData<RadioMovilForm>(getMovilesRadio)
  const [id, setId] = useState(null)

  const handleCloseEdit = () => {
    setId(null)
  }

  const handleOpenEdit = (id) => {
    setId(id)
  }
  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <MovilCreateForm refresh={refreshMovilesPost} />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Movil</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Novedades</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {moviles.map((row) => (
            <TableRow>
              <TableCell>{row.movil}</TableCell>
              <TableCell>{row.estado}</TableCell>
              <TableCell>{row.novedades}</TableCell>
              <TableCell>
                <EditIcon
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleOpenEdit(row.movil)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {id && table === 'moviles' && (
        <MovilEditForm
          id={id}
          refresh={refreshMovilesPut}
          handleClose={handleCloseEdit}
        />
      )}
    </Box>
  )
}

export default MovilesTable
