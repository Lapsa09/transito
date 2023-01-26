import React, { Fragment, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material'
import { Add } from '@mui/icons-material'
import styles from '../../styles/Sueldos.module.css'
import { useCreate, useGetList, useUpdate } from 'react-admin'

function QuickCreate({ children, handleSubmit, title, reset }) {
  const [open, setOpen] = useState(false)

  const handleExit = () => {
    reset()
    setOpen(false)
  }
  return (
    <Fragment>
      <Button
        className={styles.button}
        onClick={() => setOpen(true)}
        label="ra.action.create"
      >
        <Add />
      </Button>
      <Dialog
        fullWidth
        open={open}
        onClose={handleExit}
        aria-label="Create post"
      >
        <DialogTitle>{title}</DialogTitle>

        <form
          onSubmit={(e) => {
            handleSubmit(e)
            handleExit()
          }}
        >
          <DialogContent>{children}</DialogContent>
          <DialogActions>
            <Button onClick={handleExit}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  )
}

export function CreateCliente() {
  const { refetch } = useGetList('clientes/list')
  const [value, setValue] = useState('')
  const reset = () => setValue('')
  const [create] = useCreate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await create(
      'clientes/list',
      { data: { cliente: value } },
      { onSuccess: await refetch() }
    )
  }
  return (
    <QuickCreate
      handleSubmit={handleSubmit}
      reset={reset}
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
  const { refetch } = useGetList('operarios/list')
  const [value, setValue] = useState({ id: '', name: '' })
  const reset = () => setValue({ id: '', name: '' })
  const [create] = useCreate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await create(
      'operarios/list',
      { data: value },
      { onSuccess: await refetch() }
    )
  }
  return (
    <QuickCreate
      handleSubmit={handleSubmit}
      reset={reset}
      title="Nuevo Operario"
    >
      <TextField
        value={value.id}
        type="number"
        onChange={(e) => setValue({ ...value, id: e.target.value })}
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
