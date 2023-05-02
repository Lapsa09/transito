import React from 'react'
import { Button, Dialog } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridColumns } from '@mui/x-data-grid'
import { useDispatch, useSelector } from 'react-redux'
import { history } from '../utils'
import styles from '../styles/Operativos.page.module.css'
import { geocoding } from '../services'
import { Loader } from '../components'
import { useSnackBar } from '../hooks'
import { IRootState, setId } from '../redux'
import { Roles, User } from '../types'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'

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
  const dispatch = useDispatch()

  const handleGeocode = async () => {
    try {
      await geocoding(path)
      handleSuccess('Geocoding realizado con exito')
    } catch (error) {
      handleError(error)
    }
  }

  const handleEditClick = (id: number) => () => {
    dispatch(setId(id))
    handleOpen()
  }

  const handleDeleteClick = (id: number) => async () => {
    //TODO
  }

  const finalColumns = [
    ...columns,
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ]
      },
    },
  ]

  return user.rol === Roles.ADMIN ? (
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
      {loading ? (
        <Loader />
      ) : (
        <DataGrid rows={operativos} columns={finalColumns} />
      )}
    </div>
  ) : (
    <div className={styles.Operativos}>{children}</div>
  )
}

export default OperativosLayout
