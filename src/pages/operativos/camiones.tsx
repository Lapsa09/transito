import React, { useState } from 'react'
import { CamionesForm } from '../../components'
import { getOperativosCamiones } from '../../services'
import Layout from '../../layouts/OperativosLayout'
import { dateFormat, timeFormat, history } from '../../utils'
import { useData } from '../../hooks'
import { useSelector } from 'react-redux'
import { IRootState } from '../../redux'
import { GridColumns } from '@mui/x-data-grid'
import { OperativoCamiones, User } from '../../types'

function CamionesPage() {
  const [open, setOpen] = useState(false)
  const handleClose = () => setOpen(false)
  const handleOpen = () => setOpen(true)
  const user = useSelector<IRootState, User>((x) => x.user.user)
  const { data, loading, refresh } = useData<OperativoCamiones>(
    getOperativosCamiones
  )

  const columns: GridColumns<OperativoCamiones> = [
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
    { field: 'hora', headerName: 'Hora', width: 300 },
    { field: 'turno', headerName: 'Turno', width: 300 },
    { field: 'legajo', headerName: 'Legajo', width: 300 },
    { field: 'direccion', headerName: 'Direccion', width: 300 },
    { field: 'localidad', headerName: 'Localidad', width: 300 },
    { field: 'cp', headerName: 'Codigo postal', width: 300 },
    { field: 'dominio', headerName: 'Dominio', width: 300 },
    { field: 'origen', headerName: 'Origen', width: 300 },
    { field: 'localidad_origen', headerName: 'Localidad Origen', width: 300 },
    { field: 'destino', headerName: 'Destino', width: 300 },
    { field: 'localidad_destino', headerName: 'Localidad Destino', width: 300 },
    { field: 'licencia', headerName: 'Nro licencia', width: 300 },
    {
      field: 'remito',
      headerName: 'Remito',
      width: 300,
      valueFormatter: ({ value }) => (value ? 'SI' : 'NO'),
    },
    {
      field: 'carga',
      headerName: 'Carga',
      width: 300,
      valueFormatter: ({ value }) => (value ? 'SI' : 'NO'),
    },
    { field: 'resolucion', headerName: 'Resolucion', width: 300 },
    { field: 'acta', headerName: 'Acta', width: 300 },
    { field: 'motivo', headerName: 'Motivo', width: 300 },
    {
      field: 'hora_carga',
      headerName: 'Hora de carga',
      width: 300,
      valueFormatter: ({ value }) => timeFormat(value),
    },
    { field: 'legajo_carga', headerName: 'Legajo carga', width: 300 },
  ]

  return (
    <Layout
      open={open}
      handleOpen={handleOpen}
      handleClose={handleClose}
      columns={columns}
      operativos={data}
      loading={loading}
      path="Camiones"
    >
      <CamionesForm
        afterCreate={refresh}
        handleClose={user.isAdmin() ? handleClose : () => history.navigate('/')}
      />
    </Layout>
  )
}

export default CamionesPage
