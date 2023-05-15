import React, { useState } from 'react'
import { ControlDiarioForm } from '../../components'
import { getControles } from '../../services'
import { useSelector } from 'react-redux'
import Layout from '../../layouts/OperativosLayout'
import { dateFormat, dateTimeSQLFormat, timeFormat } from '../../utils'
import { useData } from '../../hooks'
import { IRootState } from '../../redux'
import { GridColumns } from '@mui/x-data-grid'
import { OperativoDiario, User } from '../../types'
import { useNavigate } from 'react-router-dom'

function ControlDiarioPage() {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const user = useSelector<IRootState, User>((x) => x.user.user)
  const { data, loading, refreshPost } = useData<OperativoDiario>(getControles)
  const navigate = useNavigate()

  const columns: GridColumns<OperativoDiario> = [
    {
      field: 'fecha',
      headerName: 'Fecha',
      valueFormatter: ({ value }) => dateFormat(value),
      width: 100,
    },
    {
      field: 'hora',
      headerName: 'Hora',
      width: 100,
      valueFormatter: ({ value }) => timeFormat(value),
    },
    { field: 'legajo_planilla', headerName: 'Legajo planilla', width: 150 },
    { field: 'turno', headerName: 'Turno', width: 150 },
    { field: 'direccion', headerName: 'Direccion', width: 250 },
    { field: 'dominio', headerName: 'Dominio', width: 150 },
    { field: 'barrio', headerName: 'Localidad', width: 150 },
    { field: 'motivo', headerName: 'Motivo', width: 250 },
    { field: 'otro_motivo', headerName: 'Otro motivo', width: 250 },
    { field: 'resolucion', headerName: 'Resolucion', width: 150 },
    { field: 'acta', headerName: 'Acta', width: 150 },
    {
      field: 'fechacarga',
      headerName: 'Fecha carga',
      width: 150,
      valueFormatter: ({ value }) => (value ? dateTimeSQLFormat(value) : ''),
    },
    { field: 'lpcarga', headerName: 'Legajo carga', width: 150 },
    { field: 'mes', headerName: 'Mes', width: 150 },
  ]
  return (
    <Layout
      open={open}
      handleOpen={handleOpen}
      handleClose={handleClose}
      loading={loading}
      columns={columns}
      operativos={data}
      path="Diario"
    >
      <ControlDiarioForm
        afterCreate={refreshPost}
        handleClose={user.isAdmin() ? handleClose : () => navigate('/')}
      />
    </Layout>
  )
}

export default ControlDiarioPage
