import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { getColor } from '../../utils'
import React from 'react'

function TableWaze({ data }) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <th className="MuiTableCell-head">Calles</th>
            <th className="MuiTableCell-head">Nivel de Trafico</th>
            <th className="MuiTableCell-head">Tiempo</th>
            <th className="MuiTableCell-head">Tiempo Historico</th>
            <th className="MuiTableCell-head">Velocidad</th>
            <th className="MuiTableCell-head">Velocidad Historica</th>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((value) => (
            <TableRow key={value.id}>
              <TableCell>{value.calles}</TableCell>
              <TableCell
                style={{
                  WebkitTextFillColor: getColor(value.trafico),
                  WebkitTextStroke: '0.8px rgb(0,0,0,0.15)',
                  fontWeight: 700,
                }}
                color={getColor(value.trafico)}
              >
                {value.trafico}
              </TableCell>
              <TableCell>{value.tiempo} min</TableCell>
              <TableCell>{value.tiempo_hist} min</TableCell>
              <TableCell>{value.velocidad} km/h</TableCell>
              <TableCell>{value.velocidad_hist} km/h</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableWaze
