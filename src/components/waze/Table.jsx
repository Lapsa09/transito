import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import React from 'react'
import GaugeChart from 'react-gauge-chart'

const NIVEL_TRAFICO = [
  'NORMAL',
  'TRAFICO LIGERO',
  'TRAFICO MODERADO',
  'TRAFICO PESADO',
  'EMBOTELLAMIENTO',
]

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
                  padding: 0,
                  paddingTop: '16px',
                }}
              >
                <GaugeChart
                  id={`${value.calles}-${value.id}`}
                  nrOfLevels={5}
                  style={{ width: '70%', fontWeight: 700 }}
                  arcPadding={0}
                  cornerRadius={0}
                  percent={(value.trafico - 1) / 5 + 0.05}
                  textColor="000000"
                  needleColor="#0a9396"
                  needleBaseColor="#0a9396"
                  formatTextValue={(value) =>
                    NIVEL_TRAFICO[((value - 5) * 5) / 100]
                  }
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
