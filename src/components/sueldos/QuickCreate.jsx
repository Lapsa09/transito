import React, { Fragment, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material'
import styles from '../../styles/Sueldos.module.css'
import {
  useCreate,
  useCreateSuggestionContext,
  useGetList,
  useUpdate,
} from 'react-admin'

function QuickCreate({ children, handleSubmit, title, handleExit }) {
  return (
    <Dialog fullWidth open onClose={handleExit} aria-label="Create post">
      <DialogTitle>{title}</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button onClick={handleExit}>Cancelar</Button>
          <Button type="submit">Guardar</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export function CreateCliente() {
  const { filter, onCancel, onCreate } = useCreateSuggestionContext()
  const [value, setValue] = useState(filter.toUpperCase() || '')
  const [create] = useCreate()

  const handleSubmit = (e) => {
    e.preventDefault()
    create(
      'clientes/list',
      { data: { cliente: value } },
      {
        onSuccess: (data) => {
          onCreate(data)
        },
      }
    )
  }

  const handleExit = () => {
    setValue('')
    onCancel()
  }

  return (
    <QuickCreate
      handleSubmit={handleSubmit}
      handleExit={handleExit}
      title="Nuevo Cliente"
    >
      <TextField
        value={value}
        onChange={(e) => setValue(e.target.value.toUpperCase())}
        label="Cliente"
        autoFocus
      />
    </QuickCreate>
  )
}

export function CreateOperario() {
  const { filter, onCancel, onCreate } = useCreateSuggestionContext()
  const [value, setValue] = useState({
    id: +filter || '',
    name: !+filter ? filter.toUpperCase() : '',
  })
  const reset = () => setValue({ id: '', name: '' })
  const [create] = useCreate()

  const handleSubmit = (e) => {
    e.preventDefault()
    create(
      'operarios/list',
      { data: value },
      {
        onSuccess: (data) => {
          onCreate(data)
        },
      }
    )
  }

  const handleExit = () => {
    reset()
    onCancel()
  }
  return (
    <QuickCreate
      handleSubmit={handleSubmit}
      handleExit={handleExit}
      title="Nuevo Operario"
    >
      <TextField
        value={value.id}
        type="number"
        onChange={(e) => setValue({ ...value, id: +e.target.value })}
        label="Legajo"
        autoFocus
      />
      <TextField
        value={value.name}
        onChange={(e) =>
          setValue({ ...value, name: e.target.value.toUpperCase() })
        }
        label="Cliente"
      />
    </QuickCreate>
  )
}

export function CreateMemo({ id, resource }) {
  const { refetch } = useGetList(resource)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [update] = useUpdate()

  const handleExit = () => {
    setValue('')
    setOpen(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    await update(
      'memos',
      { id, data: { memo: value } },
      {
        onSuccess: refetch,
        onSettled: handleExit,
        onError: (e) => console.log(e),
      }
    )
  }
  return (
    <Fragment>
      <Button
        className={styles.button}
        onClick={() => setOpen(true)}
        label="Agregar Memo"
      >
        Agregar Memo
      </Button>
      <Dialog
        fullWidth
        open={open}
        onClose={handleExit}
        aria-label="Create post"
      >
        <DialogTitle>Agregar Memo</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              value={value}
              onChange={(e) => setValue(e.target.value)}
              label="Memo"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleExit}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  )
}
