import React from 'react'
import { Button, Modal } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useSelector } from 'react-redux'
import { history } from '../utils/history'
import styles from '../styles/Operativos.page.module.css'
import { geocoding } from '../services/operativosService'
import { CustomSnackbar } from '../components/ui'
import { useSnackBar } from '../hooks'

function OperativosLayout({
  columns,
  operativos,
  children,
  loading,
  open,
  handleOpen,
  handleClose,
  path,
}) {
  const user = useSelector((x) => x.user.user)
  const { openSB, closeSnackbar, response, setError, setSuccess } =
    useSnackBar()

  const handleGeocode = async () => {
    try {
      await geocoding(path)
      setSuccess('Geocoding realizado con exito')
    } catch (error) {
      setError(error.response?.data)
    }
  }
  return user?.rol === 'ADMIN' ? (
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
        <Button variant="contained" color="secondary" onClick={handleGeocode}>
          Geocodificar
        </Button>
      </div>
      <Modal open={open} onClose={handleClose}>
        {children}
      </Modal>
      {loading ? (
        <img
          src="/loading.gif"
          alt="loading"
          style={{ width: '35%', marginInline: 'auto' }}
        />
      ) : (
        <DataGrid rows={operativos} columns={columns} />
      )}
      <CustomSnackbar
        res={response}
        open={openSB}
        handleClose={closeSnackbar}
      />
    </div>
  ) : (
    <div className={styles.Operativos}>{children}</div>
  )
}

export default OperativosLayout
