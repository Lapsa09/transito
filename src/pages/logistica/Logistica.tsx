import React, { useState } from 'react'
import { OperativosLayout } from '../../layouts'
import { useData } from '../../hooks'
import { Logistica } from '../../types'
import { LogisticaForm } from '../../components'
import { GridColumns } from '@mui/x-data-grid'
import { dateFormat } from '../../utils'
import { getCompras } from '../../services'

function Logistica() {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const { data, loading, refreshPost } = useData<Logistica>(getCompras)

  const columns: GridColumns<Logistica> = [
    {
      field: 'id',
      headerName: 'ID',
      width: 300,
    },
    {
      field: 'fecha',
      headerName: 'Fecha',
      width: 300,
      valueFormatter: ({ value }) => dateFormat(value),
    },
    {
      field: 'no_orden',
      headerName: 'No Orden',
      width: 300,
    },
    {
      field: 'area',
      headerName: 'Area',
      width: 300,
    },
    {
      field: 'tipo',
      headerName: 'Tipo',
      width: 300,
    },
    {
      field: 'cantidad',
      headerName: 'Cantidad',
      width: 300,
    },
    {
      field: 'stock',
      headerName: 'Stock',
      width: 300,
    },
    {
      field: 'taller',
      headerName: 'Taller',
      width: 300,
    },
  ]

  return (
    <OperativosLayout
      open={open}
      handleClose={handleClose}
      handleOpen={handleOpen}
      path="Logistica"
      operativos={data}
      loading={loading}
      columns={columns}
    >
      <LogisticaForm handleClose={handleClose} afterCreate={refreshPost} />
    </OperativosLayout>
  )
}

export default Logistica
