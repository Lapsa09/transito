import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import React from 'react'
import Chart from 'react-google-charts'

const NIVEL_TRAFICO = [
  'NORMAL',
  'TRAFICO LIGERO',
  'TRAFICO MODERADO',
  'TRAFICO PESADO',
  'EMBOTELLAMIENTO',
]

function TableWaze({ data }) {
  const options = {
    redFrom: 3,
    redTo: 4,
    yellowFrom: 1,
    yellowTo: 3,
    greenFrom: 0,
    greenTo: 1,
    minorTicks: 5,
    width: 100,
    height: 100,
    min: 0,
    max: 4,
  }
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
                  padding: 0,
                  paddingTop: '16px',
                }}
              >
                <Chart
                  chartType="Gauge"
                  width="100px"
                  height="100px"
                  data={[
                    ['Label', 'Value'],
                    [NIVEL_TRAFICO[value.trafico - 1], value.trafico - 1],
                  ]}
                  options={options}
                  style={{ marginInline: 'auto' }}
                />
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
