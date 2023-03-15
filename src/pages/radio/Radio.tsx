import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
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
    <div>
      <Button onClick={() => setTable('operarios')}>Operarios</Button>
      <Button onClick={() => setTable('moviles')}>Moviles</Button>
      {table === 'operarios' ? (
        <div>
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
        </div>
      ) : (
        <div>
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
        </div>
      )}
    </div>
  )
}

export default Radio
