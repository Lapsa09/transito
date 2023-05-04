import React from 'react'
import { Button, Dialog } from '@mui/material'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { useSelector } from 'react-redux'
import { history } from '../utils'
import { geocoding } from '../services'
import { Loader } from '../components'
import { useSnackBar } from '../hooks'
import { IRootState } from '../redux'
import { User } from '../types'
import styles from '../styles/Operativos.page.module.css'

interface Props<T> {
  columns: GridColumns<T>
  operativos: T[]
  children: JSX.Element
  loading: boolean
  open: boolean
  handleOpen: () => void
  handleClose: () => void
  path: string
}

function OperativosLayout<T>({
  columns,
  operativos,
  children,
  loading,
  open,
  handleOpen,
  handleClose,
  path,
}: Props<T>) {
  const user = useSelector<IRootState, User>((x) => x.user.user)
  const { handleError, handleSuccess } = useSnackBar()

  const handleGeocode = async () => {
    try {
      await geocoding(path)
      handleSuccess('Geocoding realizado con exito')
    } catch (error) {
      handleError(error)
    }
  }
  return user.isAdmin() ? (
    <div className={styles.Operativos}>
      <h1 style={{ textAlign: 'center' }}>{path}</h1>
      <div className="control_buttons">
        <Button
          color="error"
          variant="contained"
          onClick={() => history.navigate('/', { replace: true })}
        >
          Atras
        </Button>
        <Button variant="contained" onClick={handleOpen}>
          Nuevo
        </Button>
        {['Motos', 'Autos', 'Camiones'].includes(path) && (
          <Button variant="contained" color="secondary" onClick={handleGeocode}>
            Geocodificar
          </Button>
        )}
      </div>
      <Dialog fullWidth maxWidth="lg" open={open} onClose={handleClose}>
        {children}
      </Dialog>
      {loading ? <Loader /> : <DataGrid rows={operativos} columns={columns} />}
    </div>
  ) : (
    <div className={styles.Operativos}>{children}</div>
  )
}

export default OperativosLayout
