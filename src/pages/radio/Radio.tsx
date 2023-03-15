import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
} from '@mui/material'
import React, { useState } from 'react'
import {
  MovilCreateForm,
  MovilEditForm,
  OperativosCreateForm,
  OperativosEditForm,
} from '../../components'
import { useData } from '../../hooks'
import { getMovilesRadio, getOperariosRadio } from '../../services'
import { RadioMovilForm, RadioOPForm } from '../../types'

function Radio() {
  const [table, setTable] = useState('operarios')
  const { data: operarios, refresh: refreshOperarios } =
    useData<RadioOPForm>(getOperariosRadio)
  const { data: moviles, refresh: refreshMoviles } =
    useData<RadioMovilForm>(getMovilesRadio)

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 2,
      }}
    >
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', width: '25%' }}
      >
        <Button variant="outlined" onClick={() => setTable('operarios')}>
          Operarios
        </Button>
        <Button variant="outlined" onClick={() => setTable('moviles')}>
          Moviles
        </Button>
      </Box>
      {table === 'operarios' ? (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          <OperativosCreateForm refresh={refreshOperarios} />
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
                  <TableCell>{row.asistencia}</TableCell>
                  <TableCell>{row.qth}</TableCell>
                  <TableCell>{row.novedades}</TableCell>
                  <TableCell>
                    <OperativosEditForm
                      values={row}
                      refresh={refreshOperarios}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      ) : (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          <MovilCreateForm refresh={refreshMoviles} />
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
                    <MovilEditForm values={row} refresh={refreshMoviles} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Box>
  )
}

export default Radio
