import React, { useState } from 'react'
import OperativosForm from 'components/forms/AutosForm'
import { getOperativosAutos } from 'services/operativosService'
import Layout from 'layouts/OperativosLayout'
import { useSelector } from 'react-redux'
import { dateFormat, dateTimeFormat, timeFormat, history } from 'utils'
import { useData } from 'hooks'
import { IRootState } from '@redux/store'
import { GridColumns } from '@mui/x-data-grid'
import { OperativoAutos } from 'types/Operativos'
import { User } from 'types/Misc'

function AutosPage() {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const user = useSelector<IRootState, User>((x) => x.user.user)
  const handleRol = () => user?.rol === 'ADMIN'
  const { data, loading, refresh } = useData<OperativoAutos>(getOperativosAutos)

  const columns: GridColumns<OperativoAutos[]> = [
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
      field: 'hora',
      headerName: 'Hora',
      width: 300,
      valueFormatter: ({ value }) => timeFormat(value),
    },
    { field: 'qth', headerName: 'Direccion', width: 300 },
    { field: 'barrio', headerName: 'Localidad', width: 300 },
    { field: 'cp', headerName: 'Codigo postal', width: 300 },
    { field: 'legajo_a_cargo', headerName: 'Legajo a cargo', width: 300 },
    { field: 'legajo_planilla', headerName: 'Legajo planilla', width: 300 },
    { field: 'turno', headerName: 'Turno', width: 300 },
    { field: 'seguridad', headerName: 'Seguridad', width: 300 },
    { field: 'dominio', headerName: 'Dominio', width: 300 },
    { field: 'licencia', headerName: 'Nro licencia', width: 300 },
    { field: 'tipo_licencia', headerName: 'Tipo licencia', width: 300 },
    { field: 'tipo_vehiculo', headerName: 'Tipo Vehiculo', width: 300 },
    {
      field: 'zona_infractor',
      headerName: 'Localidad del infractor',
      width: 300,
    },
    { field: 'acta', headerName: 'Acta', width: 300 },
    { field: 'motivo', headerName: 'Motivo', width: 300 },
    {
      field: 'graduacion_alcoholica',
      headerName: 'Graduacion Alcoholica',
      width: 300,
    },
    { field: 'resolucion', headerName: 'Resolucion', width: 300 },
    {
      field: 'fechacarga',
      headerName: 'Fecha de carga',
      width: 300,
      valueFormatter: ({ value }) => dateTimeFormat(value),
    },
    { field: 'lpcarga', headerName: 'Legajo carga', width: 300 },
    { field: 'mes', headerName: 'Mes', width: 300 },
    { field: 'semana', headerName: 'Semana', width: 300 },
    { field: 'es_del', headerName: 'Es del', width: 300 },
    { field: 'resultado', headerName: 'Resultado', width: 300 },
  ]

  return (
    <Layout
      open={open}
      handleOpen={handleOpen}
      handleClose={handleClose}
      columns={columns}
      operativos={data}
      loading={loading}
      path="Autos"
    >
      <OperativosForm
        afterCreate={refresh}
        handleClose={handleRol() ? handleClose : () => history.navigate('/')}
      />
    </Layout>
  )
}

export default AutosPage
