import React from 'react'
import { Button, Modal, Skeleton } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useSelector } from 'react-redux'
import { history } from '../utils/history'
import styles from '../styles/Operativos.page.module.css'

function OperativosLayout({
  columns,
  operativos,
  children,
  loading,
  open,
  handleOpen,
  handleClose,
}) {
  const user = useSelector((x) => x.user.user)
  return user?.rol === 'ADMIN' ? (
    <div className={styles.Operativos}>
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
      </div>
      <Modal open={open} onClose={handleClose}>
        {children}
      </Modal>
      {loading ? (
        <Skeleton
          variant="rectangular"
          width={window.innerWidth}
          height={window.innerHeight}
        />
      ) : (
        <DataGrid rows={operativos} columns={columns} />
      )}
    </div>
  ) : (
    <div className={styles.Operativos}>{children}</div>
  )
}

export default OperativosLayout
